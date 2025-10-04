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
     * Retrieves all active, published notifications and their corresponding live data.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object with notification data.
     */
    public function get_notification_data(WP_REST_Request $request)
    {
        $notification_data = [];

        // 1. Get all PUBLISHED notification posts
        $args = array(
            'post_type'      => 'st_notification', // Use the correct, shorter CPT name
            'post_status'    => 'publish',
            'posts_per_page' => -1, // Get all of them
        );
        $query = new WP_Query($args);

        if (!$query->have_posts()) {
            return new WP_REST_Response([], 200); // Return empty if no campaigns are published
        }

        // 2. Loop through each published campaign and get its data
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();

            // Get all the saved settings for this specific notification
            $settings = get_post_meta($post_id, '_surftrust_settings', true);
            if (empty($settings)) continue;

            // Get the type of notification from its settings
            $type = isset($settings['type']) ? $settings['type'] : '';
            $data_to_add = null;

            // Depending on the type, fetch the relevant dynamic data
            switch ($type) {
                case 'sale':
                    $data_to_add = $this->get_single_recent_sale();
                    break;
                case 'review':
                    $data_to_add = $this->get_single_recent_review();
                    break;
                case 'stock':
                    $data_to_add = $this->get_single_low_stock_product();
                    break;
                case 'cookie_notice':
                case 'growth_alert':
                    $data_to_add = array('is_static' => true); // Pass a simple placeholder object
                    break;
                case 'live_visitors':
                    // Get the current user count from the cache
                    $live_users = wp_cache_get('surftrust_live_users', 'surftrust');
                    $count = is_array($live_users) ? count($live_users) : 1;
                    $data_to_add = array('count' => $count);
                    break;
                case 'sale_announcement':
                    $data_to_add = $this->get_single_sale_announcement_product();
                    break;
            }

            // If we found live data, combine it with the campaign's settings
            if ($data_to_add) {
                $notification_data[] = [
                    'id'       => $post_id,
                    'type'     => $type,
                    'settings' => $settings, // The settings saved in the campaign post meta
                    'data'     => $data_to_add,  // The live data from WooCommerce
                ];
            }
        }
        wp_reset_postdata();

        return new WP_REST_Response($notification_data, 200);
    }

    /**
     * Fetches the data for the single most recent completed sale.
     * @return array|false Sale data or false if none found.
     */
    private function get_single_recent_sale()
    {
        $args = array('limit' => 1, 'status' => 'completed', 'orderby' => 'date_created', 'order' => 'DESC');
        $orders = wc_get_orders($args);
        if (empty($orders)) return false;

        $order = reset($orders);
        $items = $order->get_items();
        if (empty($items)) return false;

        $first_item = reset($items);
        $product = $first_item->get_product();
        if (!$product) return false;

        return [
            'product_name'      => $product->get_name(),
            'product_id'        => $product->get_id(),
            'customer_name'     => $order->get_billing_first_name(),
            'city'              => $order->get_billing_city(),
            'product_image_url' => wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'),
            'product_url'       => $product->get_permalink(),
        ];
    }

    /**
     * Fetches the data for the single most recent approved review.
     * @return array|false Review data or false if none found.
     */
    private function get_single_recent_review()
    {
        $args = array('number' => 1, 'status' => 'approve', 'post_type' => 'product');
        $comments = get_comments($args);
        if (empty($comments)) return false;

        $comment = reset($comments);
        $product = wc_get_product($comment->comment_post_ID);
        if (!$product) return false;

        return [
            'product_name'  => $product->get_name(),
            'product_id'    => $product->get_id(),
            'reviewer_name' => $comment->comment_author,
            'rating'        => intval(get_comment_meta($comment->comment_ID, 'rating', true)),
            'product_url'   => $product->get_permalink(),
        ];
    }

    /**
     * Fetches the data for one random low stock product.
     * @return array|false Product data or false if none found.
     */
    private function get_single_low_stock_product()
    {
        $low_stock_products = $this->get_low_stock_products(); // Reuses our more complex query
        if (empty($low_stock_products)) return false;

        // Return a random one from the list of all low stock products
        return $low_stock_products[array_rand($low_stock_products)];
    }

    /**
     * Helper function to get all low stock products.
     * @return array A list of low stock products.
     */
    private function get_low_stock_products()
    {
        global $wpdb;

        $option_value = $wpdb->get_var("SELECT setting_value FROM {$wpdb->prefix}surftrust_settings WHERE setting_name = 'low_stock_alert'");
        $settings = json_decode($option_value, true);
        $threshold = isset($settings['threshold']) ? absint($settings['threshold']) : 5;

        $args = array(
            'limit'        => 10,
            'status'       => 'publish',
            'stock_status' => 'instock',
            'meta_query'   => array(
                'relation' => 'AND',
                array(
                    'key'   => '_manage_stock',
                    'value' => 'yes',
                ),
                array(
                    'key'     => '_stock',
                    'value'   => $threshold,
                    'compare' => '<=',
                    'type'    => 'NUMERIC',
                ),
            ),
        );

        $wc_products = wc_get_products($args);
        $products = [];

        foreach ($wc_products as $product) {
            $products[] = [
                'product_name'      => $product->get_name(),
                'product_id'        => $product->get_id(),
                'stock_count'       => $product->get_stock_quantity(),
                'product_image_url' => wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'),
                'product_url'       => $product->get_permalink(),
            ];
        }

        return $products;
    }
    // In class-surftrust-public-controller.php

    /**
     * Fetches data for one random, currently on-sale product.
     * @return array|false Product data or false if none found.
     */
    private function get_single_sale_announcement_product()
    {
        // wc_get_product_ids_on_sale() is the most efficient way to get sale items.
        $sale_product_ids = wc_get_product_ids_on_sale();

        if (empty($sale_product_ids)) {
            return false;
        }

        // Pick one random product from the list of sale items.
        $random_product_id = $sale_product_ids[array_rand($sale_product_ids)];
        $product = wc_get_product($random_product_id);

        if (! $product) {
            return false;
        }

        $regular_price = (float) $product->get_regular_price();
        $sale_price = (float) $product->get_sale_price();
        $discount = 0;
        if ($regular_price > 0) {
            $discount = round((($regular_price - $sale_price) / $regular_price) * 100);
        }

        return [
            'product_name'        => $product->get_name(),
            'product_id'          => $product->get_id(),
            'product_url'         => $product->get_permalink(),
            'product_image_url'   => wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'),
            'regular_price'       => wc_price($regular_price),
            'sale_price'          => wc_price($sale_price),
            'discount_percentage' => $discount,
            'sale_end_date'       => $product->get_date_on_sale_to() ? $product->get_date_on_sale_to()->getTimestamp() : null,
        ];
    }
}
