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
    // In /includes/api/class-surftrust-notifications-controller.php

    public function get_notifications(WP_REST_Request $request)
    {
        // You can remove this error log now if you wish.
        error_log('[SurfPop Debug] API get_notifications called. per_page param: ' . $request->get_param('per_page'));

        $notifications = [];
        $analytics_table = $GLOBALS['wpdb']->prefix . 'surftrust_analytics';

        // 1. Prepare query arguments with a safe default.
        $args = array(
            'post_type'      => 'st_notification',
            'posts_per_page' => -1, // Default to fetching all posts.
            'orderby'        => 'date',
            'order'          => 'DESC',
        );

        // --- THIS IS THE FINAL, CORRECTED FIX ---

        // 2. Get the 'per_page' parameter from the request.
        $limit = $request->get_param('per_page');

        // 3. Check if the parameter exists and is a valid, positive number.
        // We use isset() because it correctly checks for existence, even if the value is '0'.
        // We also sanitize it to an integer to be safe.
        if (isset($limit) && is_numeric($limit) && (int)$limit > 0) {
            // If it's valid, apply it to our database query arguments.
            $args['posts_per_page'] = (int)$limit;
        }

        // --- END OF FIX ---

        // Filter by status (publish/draft)
        $status_filter = $request->get_param('status');
        if (in_array($status_filter, array('publish', 'draft'))) {
            $args['post_status'] = $status_filter;
        }

        // Filter by search query
        $search_query = $request->get_param('search');
        if (!empty($search_query)) {
            $args['s'] = sanitize_text_field($search_query);
        }

        // Execute the main query for notification posts
        $query = new WP_Query($args);

        if (!$query->have_posts()) {
            return new WP_REST_Response([], 200);
        }

        // Loop through each post and build the data object
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $settings = get_post_meta($post_id, '_surftrust_settings', true);

            $views = (int) $GLOBALS['wpdb']->get_var($GLOBALS['wpdb']->prepare(
                "SELECT COUNT(id) FROM $analytics_table WHERE event_type = 'view' AND notification_id = %d",
                $post_id
            ));
            $clicks = (int) $GLOBALS['wpdb']->get_var($GLOBALS['wpdb']->prepare(
                "SELECT COUNT(id) FROM $analytics_table WHERE event_type = 'click' AND notification_id = %d",
                $post_id
            ));

            $notifications[] = [
                'id'     => $post_id,
                'title'  => get_the_title(),
                'status' => get_post_status(),
                'type'   => isset($settings['type']) ? $settings['type'] : 'unknown',
                'stats'  => ['views' => $views, 'clicks' => $clicks],
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
    /**
     * Deletes (trashes) a notification post.
     *
     * @param WP_REST_Request $request The request object, containing the post ID.
     * @return WP_REST_Response A success or error message.
     */
    public function delete_notification(WP_REST_Request $request)
    {
        $post_id = $request->get_param('id');
        $post = get_post($post_id);

        // Security check: ensure post exists and is our CPT
        if (! $post || $post->post_type !== 'st_notification') {
            return new WP_REST_Response(['error' => 'Invalid notification ID.'], 404);
        }

        // Use the safe WordPress function to move the post to the trash
        $result = wp_trash_post($post_id);

        if (! $result) {
            return new WP_REST_Response(['error' => 'Failed to delete notification.'], 500);
        }

        return new WP_REST_Response(['success' => true, 'message' => 'Notification moved to trash.'], 200);
    }
    // In an appropriate admin controller class

    /**
     * A REST API endpoint to search for posts, pages, and products by title.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response A list of found posts.
     */
    public function search_posts_by_title(WP_REST_Request $request)
    {
        $search_term = $request->get_param('search');
        if (empty($search_term)) {
            return new WP_REST_Response([], 200);
        }

        $post_types = ['post', 'page', 'product']; // Post types to search
        $results = [];

        $query = new WP_Query([
            's'              => sanitize_text_field($search_term),
            'post_type'      => $post_types,
            'posts_per_page' => 20, // Limit results
            'post_status'    => 'publish',
        ]);

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $results[] = [
                    'id'    => get_the_ID(),
                    'title' => get_the_title(),
                    'type'  => get_post_type(),
                ];
            }
        }
        wp_reset_postdata();

        return new WP_REST_Response($results, 200);
    }
}
