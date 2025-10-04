<?php

/**
 * Handles the custom meta box for the Notification builder.
 *
 * @package    Surftrust
 * @subpackage Surftrust/admin
 */
class Surftrust_Metabox
{

    /**
     * Hook into WordPress to add the meta box and save its data.
     */
    public function __construct()
    {
        add_action('add_meta_boxes', array($this, 'add_meta_box'));
        // --- ADD THIS HOOK ---
        // This action fires whenever a post is saved.
        add_action('save_post_st_notification', array($this, 'save_meta_box'));
    }

    /**
     * Add the meta box to the 'st_notification' CPT edit screen.
     */
    public function add_meta_box()
    {
        add_meta_box(
            'surftrust_builder_metabox',
            'Notification Builder',
            array($this, 'render_meta_box'),
            'st_notification',
            'normal',
            'high'
        );
    }

    /**
     * Render the HTML for the meta box.
     */
    public function render_meta_box($post)
    {
        // We add a nonce field for security
        wp_nonce_field('surftrust_save_meta_box_data', 'surftrust_meta_box_nonce');
        $saved_settings = get_post_meta($post->ID, '_surftrust_settings', true);
        echo '<div id="surftrust-builder-app"></div>';
    }

    // --- ADD THIS ENTIRE NEW FUNCTION ---
    /**
     * Save the meta box data when the post is saved.
     *
     * @param int $post_id The ID of the post being saved.
     */
    public function save_meta_box($post_id)
    {
        // 1. Security Check: Verify the nonce sent from our meta box.
        if (! isset($_POST['surftrust_meta_box_nonce']) || ! wp_verify_nonce($_POST['surftrust_meta_box_nonce'], 'surftrust_save_meta_box_data')) {
            return;
        }

        // 2. Security Check: Ignore autosaves.
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // 3. Security Check: Ensure the user has permission to edit the post.
        if (! current_user_can('edit_post', $post_id)) {
            return;
        }

        // 4. Check if our hidden settings field was submitted.
        if (! isset($_POST['_surftrust_settings'])) {
            return;
        }

        // 5. Get the raw JSON string from the hidden textarea.
        $settings_json = wp_unslash($_POST['_surftrust_settings']);

        // 6. Decode the JSON string into a PHP associative array.
        $raw_data = json_decode($settings_json, true);

        // 7. Validate that we have a proper array to work with.
        if (! is_array($raw_data)) {
            return;
        }

        // 8. Sanitize and build the final, clean settings array.
        $sanitized_settings = [];

        // Sanitize the 'type' (e.g., 'sale', 'review').
        if (! empty($raw_data['type'])) {
            $sanitized_settings['type'] = sanitize_text_field($raw_data['type']);
        }

        $type = $sanitized_settings['type'];

        // Sanitize settings based on the notification type.
        if ($type === 'sale' && isset($raw_data['sales_notification'])) {
            $sanitized_settings['sales_notification']['message'] = sanitize_textarea_field($raw_data['sales_notification']['message']);
        }
        if ($type === 'review' && isset($raw_data['review_displays'])) {
            $sanitized_settings['review_displays']['min_rating'] = absint($raw_data['review_displays']['min_rating']);
        }
        if ($type === 'stock' && isset($raw_data['low_stock_alert'])) {
            $sanitized_settings['low_stock_alert']['threshold'] = absint($raw_data['low_stock_alert']['threshold']);
        }
        if ($type === 'cookie_notice' && isset($raw_data['cookie_notice'])) {
            $sanitized_settings['cookie_notice']['message'] = sanitize_textarea_field($raw_data['cookie_notice']['message']);
            $sanitized_settings['cookie_notice']['button_text'] = sanitize_text_field($raw_data['cookie_notice']['button_text']);
        }
        if ($type === 'growth_alert' && isset($raw_data['growth_alert'])) {
            $sanitized_settings['growth_alert']['message'] = sanitize_text_field($raw_data['growth_alert']['message']);
            $sanitized_settings['growth_alert']['enable_facebook'] = ! empty($raw_data['growth_alert']['enable_facebook']);
            $sanitized_settings['growth_alert']['enable_twitter'] = ! empty($raw_data['growth_alert']['enable_twitter']);
            $sanitized_settings['growth_alert']['enable_pinterest'] = ! empty($raw_data['growth_alert']['enable_pinterest']);
        }
        if ($type === 'live_visitors' && isset($raw_data['live_visitors'])) {
            $sanitized_settings['live_visitors']['message'] = sanitize_textarea_field($raw_data['live_visitors']['message']);
        }
        // Sanitize all 'customize' settings if they exist.
        if (isset($raw_data['customize']) && is_array($raw_data['customize'])) {
            foreach ($raw_data['customize'] as $key => $value) {
                // Use specific sanitization for colors, otherwise default to text.
                if (in_array($key, array('background_color', 'font_color'))) {
                    $sanitized_settings['customize'][$key] = sanitize_hex_color($value);
                } else {
                    $sanitized_settings['customize'][$key] = sanitize_text_field($value);
                }
            }
        }
if ( $type === 'sale_announcement' && isset( $raw_data['sale_announcement'] ) ) {
    $sanitized_settings['sale_announcement']['message'] = sanitize_textarea_field( $raw_data['sale_announcement']['message'] );
}
        // 9. Inject the Post ID into the saved data. This is crucial for analytics.
        $sanitized_settings['id'] = $post_id;

        // 10. Save the final, clean PHP array to the database.
        // WordPress will handle serializing this array for storage.
        update_post_meta($post_id, '_surftrust_settings', $sanitized_settings);
    }
}
