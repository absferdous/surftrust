<?php

/**
 * Controller for handling all public-facing API requests.
 *
 * @package Surftrust
 * @subpackage Surftrust/includes/api
 */
class Surftrust_Public_Controller
{

    /**
     * Retrieves all data needed for displaying notifications.
     * This includes sales, reviews, and low stock alerts.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object with notification data.
     */
    public function get_notification_data(WP_REST_Request $request)
    {
        $data = [
            'sales'   => $this->get_recent_sales(),
            'reviews' => $this->get_recent_reviews(),
            'stock'   => $this->get_low_stock_products()
        ];

        return new WP_REST_Response($data, 200);
    }



    /**
     * Fetches the 10 most recent completed WooCommerce orders.
     *
     * @return array An array of recent sales data.
     */
    private function get_recent_sales()
    {
        $sales = [];
        $args = array(
            'limit'  => 10,
            'status' => 'completed',
            'orderby' => 'date_created',
            'order' => 'DESC',
        );
        $orders = wc_get_orders($args);

        foreach ($orders as $order) {
            $items = $order->get_items();
            if (empty($items)) {
                continue; // Skip if order has no items
            }
            $first_item = reset($items);

            $product_id = $first_item->get_product_id();
            $product = wc_get_product($product_id);

            // --- ROBUSTNESS CHECK ---
            // Skip this item if the product doesn't exist anymore
            if (! $product) {
                continue;
            }

            $sales[] = [
                'customer_name' => $order->get_billing_first_name(),
                'product_name'      => $first_item->get_name(),
                'product_id'        => $product_id,
                'city'              => $order->get_billing_city(),
                'country'           => $order->get_billing_country(),
                'time_ago'          => human_time_diff($order->get_date_created()->getTimestamp(), current_time('timestamp')) . ' ago',
                'product_image_url' => wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'),
                'product_url'       => $product->get_permalink(),
            ];
        }
        return $sales;
    }

    /**
     * Fetches the 10 most recent approved WooCommerce reviews.
     *
     * @return array An array of recent review data.
     */
    private function get_recent_reviews()
    {
        $reviews = [];
        $args = array(
            'number' => 10,
            'status' => 'approve',
            'post_type' => 'product',
        );
        $comments = get_comments($args);

        foreach ($comments as $comment) {
            $product = wc_get_product($comment->comment_post_ID);
            if (!$product) continue;

            $reviews[] = [
                'product_name'  => $product->get_name(),
                'product_id'    => $product->get_id(),
                'reviewer_name' => $comment->comment_author,
                'rating'        => intval(get_comment_meta($comment->comment_ID, 'rating', true)),
                'content'       => $comment->comment_content,
                'product_url'   => $product->get_permalink(),
            ];
        }
        return $reviews;
    }
    private function get_low_stock_products()
    {
        global $wpdb;

        // Fetch the threshold from our saved settings.
        // This is a direct, efficient way to get a single setting value.
        $option_value = $wpdb->get_var("SELECT setting_value FROM {$wpdb->prefix}surftrust_settings WHERE setting_name = 'low_stock_alert'");
        $settings = json_decode($option_value, true);
        $threshold = isset($settings['threshold']) ? absint($settings['threshold']) : 5; // Default to 5 if not set

        $products = [];
        $args = array(
            'post_type'      => 'product',
            'posts_per_page' => 10,
            'meta_query'     => array(
                'relation' => 'AND',
                array(
                    'key'     => '_manage_stock',
                    'value'   => 'yes',
                ),
                array(
                    'key'     => '_stock',
                    'value'   => $threshold,
                    'compare' => '<=',
                    'type'    => 'NUMERIC',
                ),
                array(
                    'key'     => '_stock_status',
                    'value'   => 'instock',
                ),
            ),
        );
        $query = new WP_Query($args);

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product = wc_get_product(get_the_ID());
                $products[] = [
                    'product_name'      => $product->get_name(),
                    'product_id'        => $product->get_id(),
                    'stock_count'       => $product->get_stock_quantity(),
                    'product_image_url' => wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'),
                    'product_url'       => $product->get_permalink(),
                ];
            }
        }
        wp_reset_postdata();
        return $products;
    }
}
