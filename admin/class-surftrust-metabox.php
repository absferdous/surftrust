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
            return; // Exit if no type is set, as we can't sanitize properly.
        }
        $type = $sanitized_settings['type'];

        // 4. Sanitize All Data

        // Reusable helper function for sanitizing display_rules arrays
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
            $data_to_sanitize = $raw_data['sales_notification'];
            $sanitized_settings['sales_notification']['message'] = sanitize_textarea_field($data_to_sanitize['message']);
            if (isset($data_to_sanitize['display_rules'])) {
                $sanitized_settings['sales_notification']['display_rules'] = $sanitize_display_rules($data_to_sanitize['display_rules']);
            }
        }
        if ($type === 'review' && isset($raw_data['review_displays'])) {
            $data_to_sanitize = $raw_data['review_displays'];
            $sanitized_settings['review_displays']['message'] = sanitize_textarea_field($data_to_sanitize['message']);
            $sanitized_settings['review_displays']['min_rating'] = absint($data_to_sanitize['min_rating']);
            if (isset($data_to_sanitize['display_rules'])) {
                $sanitized_settings['review_displays']['display_rules'] = $sanitize_display_rules($data_to_sanitize['display_rules']);
            }
        }
        if ($type === 'stock' && isset($raw_data['low_stock_alert'])) {
            $data_to_sanitize = $raw_data['low_stock_alert'];
            $sanitized_settings['low_stock_alert']['message'] = sanitize_textarea_field($data_to_sanitize['message']);
            $sanitized_settings['low_stock_alert']['threshold'] = absint($data_to_sanitize['threshold']);
            if (isset($data_to_sanitize['display_rules'])) {
                $sanitized_settings['low_stock_alert']['display_rules'] = $sanitize_display_rules($data_to_sanitize['display_rules']);
            }
        }
        if ($type === 'sale_announcement' && isset($raw_data['sale_announcement'])) {
            $data_to_sanitize = $raw_data['sale_announcement'];
            $sanitized_settings['sale_announcement']['message'] = sanitize_textarea_field($data_to_sanitize['message']);
            if (isset($data_to_sanitize['display_rules'])) {
                $sanitized_settings['sale_announcement']['display_rules'] = $sanitize_display_rules($data_to_sanitize['display_rules']);
            }
        }
        if ($type === 'cookie_notice' && isset($raw_data['cookie_notice'])) {
            $data_to_sanitize = $raw_data['cookie_notice'];
            $sanitized_settings['cookie_notice']['message'] = sanitize_textarea_field($data_to_sanitize['message']);
            $sanitized_settings['cookie_notice']['button_text'] = sanitize_text_field($data_to_sanitize['button_text']);
        }
        if ($type === 'growth_alert' && isset($raw_data['growth_alert'])) {
            $data_to_sanitize = $raw_data['growth_alert'];
            $sanitized_settings['growth_alert']['message'] = sanitize_text_field($data_to_sanitize['message']);
            $sanitized_settings['growth_alert']['enable_facebook'] = ! empty($data_to_sanitize['enable_facebook']);
            $sanitized_settings['growth_alert']['enable_twitter'] = ! empty($data_to_sanitize['enable_twitter']);
            $sanitized_settings['growth_alert']['enable_pinterest'] = ! empty($data_to_sanitize['enable_pinterest']);
        }
        if ($type === 'live_visitors' && isset($raw_data['live_visitors'])) {
            $data_to_sanitize = $raw_data['live_visitors'];
            $sanitized_settings['live_visitors']['message'] = sanitize_textarea_field($data_to_sanitize['message']);
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
