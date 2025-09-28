<?php

/**
 * Controller for handling all API requests related to managing notifications.
 *
 * @package    Surftrust
 * @subpackage Surftrust/includes/api
 */
class Surftrust_Notifications_Controller
{

    /**
     * Retrieves all notifications with their associated data and stats.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object with an array of notifications.
     */
    public function get_notifications(WP_REST_Request $request)
    {
        $notifications = [];
        $analytics_table = $GLOBALS['wpdb']->prefix . 'surftrust_analytics';

        // 1. Prepare query arguments based on request parameters
        $args = array(
            'post_type'      => 'st_notification',
            'posts_per_page' => -1,
            'orderby'        => 'date',
            'order'          => 'DESC',
        );

        $status_filter = $request->get_param('status');
        if (in_array($status_filter, array('publish', 'draft'))) {
            $args['post_status'] = $status_filter;
        }

        $search_query = $request->get_param('search');
        if (! empty($search_query)) {
            $args['s'] = sanitize_text_field($search_query);
        }

        // 2. Execute the main query for notification posts
        $query = new WP_Query($args);

        if (! $query->have_posts()) {
            return new WP_REST_Response([], 200);
        }

        // 3. Loop through each post and build the data object
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();

            $settings = get_post_meta($post_id, '_surftrust_settings', true);

            // --- THIS IS THE CRITICAL FIX ---
            // Fetch stats for this specific notification campaign ID
            $views = (int) $GLOBALS['wpdb']->get_var($GLOBALS['wpdb']->prepare(
                "SELECT COUNT(id) FROM $analytics_table WHERE event_type = 'view' AND notification_id = %d",
                $post_id
            ));
            $clicks = (int) $GLOBALS['wpdb']->get_var($GLOBALS['wpdb']->prepare(
                "SELECT COUNT(id) FROM $analytics_table WHERE event_type = 'click' AND notification_id = %d",
                $post_id
            ));
            // --- END FIX ---

            $notifications[] = [
                'id'     => $post_id,
                'title'  => get_the_title(),
                'status' => get_post_status(),
                'type'   => isset($settings['type']) ? $settings['type'] : 'unknown',
                'stats'  => [
                    'views' => $views,
                    'clicks' => $clicks
                ],
            ];
        }
        wp_reset_postdata();

        return new WP_REST_Response($notifications, 200);
    }

    /**
     * Toggles a notification's post status between 'publish' and 'draft'.
     */
    public function toggle_notification_status(WP_REST_Request $request)
    {
        $post_id = $request->get_param('id');
        $post = get_post($post_id);

        if (! $post || $post->post_type !== 'st_notification') {
            return new WP_REST_Response(['error' => 'Invalid notification ID.'], 404);
        }

        $current_status = $post->post_status;
        $new_status = ($current_status === 'publish') ? 'draft' : 'publish';

        $result = wp_update_post([
            'ID'          => $post_id,
            'post_status' => $new_status,
        ]);

        if (is_wp_error($result)) {
            return new WP_REST_Response(['error' => 'Failed to update status.'], 500);
        }

        return new WP_REST_Response(['new_status' => $new_status], 200);
    }

    /**
     * Duplicates a notification post and its meta data.
     */
    public function duplicate_notification(WP_REST_Request $request)
    {
        $post_id_to_duplicate = $request->get_param('id');
        $post = get_post($post_id_to_duplicate);

        if (! $post || $post->post_type !== 'st_notification') {
            return new WP_REST_Response(['error' => 'Invalid notification ID.'], 404);
        }

        $new_post_args = array(
            'post_title'   => $post->post_title . ' (Copy)',
            'post_content' => $post->post_content,
            'post_status'  => 'draft',
            'post_type'    => $post->post_type,
            'post_author'  => get_current_user_id(),
        );

        $new_post_id = wp_insert_post($new_post_args);

        if (is_wp_error($new_post_id)) {
            return new WP_REST_Response(['error' => 'Failed to create new post.'], 500);
        }

        $post_meta = get_post_meta($post_id_to_duplicate, '_surftrust_settings', true);
        if (! empty($post_meta)) {
            update_post_meta($new_post_id, '_surftrust_settings', $post_meta);
        }

        return new WP_REST_Response([
            'success' => true,
            'message' => 'Notification duplicated successfully.',
            'new_post_id' => $new_post_id
        ], 200);
    }
}
