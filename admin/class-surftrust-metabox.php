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
        // 1. Standard Security Checks
        if (! isset($_POST['surftrust_meta_box_nonce']) || ! wp_verify_nonce($_POST['surftrust_meta_box_nonce'], 'surftrust_save_meta_box_data')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (! current_user_can('edit_post', $post_id)) {
            return;
        }
        if (! isset($_POST['_surftrust_settings'])) {
            return;
        }

        // 2. Decode Data
        $raw_data = json_decode(wp_unslash($_POST['_surftrust_settings']), true);
        if (! is_array($raw_data)) {
            return;
        }

        // 3. Prepare Sanitized Array
        $sanitized_settings = [];

        if (! empty($raw_data['type'])) {
            $sanitized_settings['type'] = sanitize_text_field($raw_data['type']);
        } else {
            return; // No type, no save.
        }
        $type = $sanitized_settings['type'];

        // 4. Sanitize Type-Specific Settings & Display Rules

        // Helper function for sanitizing display_rules to avoid repetition
        $sanitize_display_rules = function ($rules_raw) {
            $sanitized = [];
            if (! empty($rules_raw['show_on']) && is_array($rules_raw['show_on'])) {
                foreach ($rules_raw['show_on'] as $post) {
                    if (isset($post['id']) && isset($post['title'])) {
                        $sanitized['show_on'][] = ['id' => absint($post['id']), 'title' => sanitize_text_field($post['title'])];
                    }
                }
            }
            if (! empty($rules_raw['hide_on']) && is_array($rules_raw['hide_on'])) {
                foreach ($rules_raw['hide_on'] as $post) {
                    if (isset($post['id']) && isset($post['title'])) {
                        $sanitized['hide_on'][] = ['id' => absint($post['id']), 'title' => sanitize_text_field($post['title'])];
                    }
                }
            }
            return $sanitized;
        };

        if ($type === 'sale' && isset($raw_data['sales_notification'])) {
            $sanitized_settings['sales_notification']['message'] = sanitize_textarea_field($raw_data['sales_notification']['message']);
            if (isset($raw_data['sales_notification']['display_rules'])) {
                $sanitized_settings['sales_notification']['display_rules'] = $sanitize_display_rules($raw_data['sales_notification']['display_rules']);
            }
        }
        if ($type === 'review' && isset($raw_data['review_displays'])) {
            $sanitized_settings['review_displays']['min_rating'] = absint($raw_data['review_displays']['min_rating']);
            if (isset($raw_data['review_displays']['display_rules'])) {
                $sanitized_settings['review_displays']['display_rules'] = $sanitize_display_rules($raw_data['review_displays']['display_rules']);
            }
        }
        if ($type === 'stock' && isset($raw_data['low_stock_alert'])) {
            $sanitized_settings['low_stock_alert']['threshold'] = absint($raw_data['low_stock_alert']['threshold']);
            if (isset($raw_data['low_stock_alert']['display_rules'])) {
                $sanitized_settings['low_stock_alert']['display_rules'] = $sanitize_display_rules($raw_data['low_stock_alert']['display_rules']);
            }
        }
        if ($type === 'sale_announcement' && isset($raw_data['sale_announcement'])) {
            $sanitized_settings['sale_announcement']['message'] = sanitize_textarea_field($raw_data['sale_announcement']['message']);
            if (isset($raw_data['sale_announcement']['display_rules'])) {
                $sanitized_settings['sale_announcement']['display_rules'] = $sanitize_display_rules($raw_data['sale_announcement']['display_rules']);
            }
        }

        // (Sanitization for cookie, growth, live_visitors remains the same as they don't have display rules yet)
        if ($type === 'cookie_notice' && isset($raw_data['cookie_notice'])) { /* ... */
        }
        if ($type === 'growth_alert' && isset($raw_data['growth_alert'])) { /* ... */
        }
        if ($type === 'live_visitors' && isset($raw_data['live_visitors'])) { /* ... */
        }


        // Sanitize 'customize' settings
        if (isset($raw_data['customize']) && is_array($raw_data['customize'])) {
            foreach ($raw_data['customize'] as $key => $value) {
                if (in_array($key, ['background_color', 'font_color'])) {
                    $sanitized_settings['customize'][$key] = sanitize_hex_color($value);
                } else {
                    $sanitized_settings['customize'][$key] = sanitize_text_field($value);
                }
            }
        }

        // Inject the Post ID
        $sanitized_settings['id'] = $post_id;

        // 5. Save the final, clean PHP array to the database.
        update_post_meta($post_id, '_surftrust_settings', $sanitized_settings);
    }
}
