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
        // 1. Check if our nonce is set.
        if (! isset($_POST['surftrust_meta_box_nonce'])) {
            return;
        }

        // 2. Verify that the nonce is valid.
        if (! wp_verify_nonce($_POST['surftrust_meta_box_nonce'], 'surftrust_save_meta_box_data')) {
            return;
        }

        // 3. If this is an autosave, our form has not been submitted, so we don't want to do anything.
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // 4. Check the user's permissions.
        if (! current_user_can('edit_post', $post_id)) {
            return;
        }

        // 5. Find our hidden textarea in the POST data. The name is '_surftrust_settings'.
        if (! isset($_POST['_surftrust_settings'])) {
            return;
        }

        // 6. Sanitize and decode the JSON string.
        $settings_json = wp_unslash($_POST['_surftrust_settings']);
        $settings_data = json_decode($settings_json, true);

        // 7. Save the data as post meta.
        // WordPress will automatically handle creating or updating the meta entry.
        update_post_meta($post_id, '_surftrust_settings', $settings_data);
    }
}
