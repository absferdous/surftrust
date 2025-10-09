<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://yourwebsite.com
 * @since      1.0.0
 * @package    Surftrust
 * @subpackage Surftrust/admin
 */
class Surftrust_Admin
{

    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Register the admin menu for the plugin.
     */
    // In /surftrust/admin/class-surftrust-admin.php

    // In /surftrust/admin/class-surftrust-admin.php

    // In /surftrust/admin/class-surftrust-admin.php

    // In /surftrust/admin/class-surftrust-admin.php

    // In class-surftrust-admin.php
    public function add_admin_menu()
    {
        add_menu_page(
            'Surftrust',                          // Page title
            'Surftrust',                          // Menu title
            'manage_options',                     // Capability
            'surftrust',                          // The one and only menu slug
            array($this, 'display_main_app_page'), // The callback to render our root div
            'dashicons-bell',                     // Icon
            30
        );
    }


    /**
     * Render the basic HTML structure for the admin page.
     * The React app will mount onto the 'surftrust-admin-app' div.
     */
    /**
     * Renders the root div for the main Settings React application.
     */

    // Add this new function
    public function display_main_app_page()
    {
        // Note the new ID that our index.js file is looking for
        echo '<div class="wrap" id="surftrust-app-root"></div>';
    }

    // Delete the old display_settings_page(), display_analytics_page(), etc.
    public function display_settings_page()
    {
        echo '<div class="wrap"><div id="surftrust-settings-app"></div></div>';
    }

    /**
     * Renders the root div for the Analytics React application.
     */
    public function display_analytics_page()
    {
        echo '<div class="wrap"><div id="surftrust-analytics-app"></div></div>';
    }

    public function display_dashboard_page()
    {
        echo '<div class="wrap"><div id="surftrust-dashboard-app"></div></div>';
    }
    public function display_all_notifications_page()
    {
        echo '<div class="wrap"><div id="surftrust-all-notifications-app"></div></div>';
    }
    /**
     * Enqueue scripts and styles for the admin area.
     */
    // In /surftrust/admin/class-surftrust-admin.php
    /**
     * Enqueue scripts and styles for the admin area.
     * This function now intelligently loads the correct script for each admin page.
     */
    // In /surftrust/admin/class-surftrust-admin.php

    // In /surftrust/admin/class-surftrust-admin.php

    public function redirect_all_notifications_link($submenu_file)
    {
        global $submenu;

        // The parent slug is 'surftrust'
        // The original CPT link is 'edit.php?post_type=st_notification'
        if (isset($submenu['surftrust'])) {
            foreach ($submenu['surftrust'] as $key => $item) {
                if ($item[2] === 'edit.php?post_type=st_notification') {
                    // We found the original link, now change its destination slug
                    $submenu['surftrust'][$key][2] = 'surftrust-all-notifications';
                }
            }
        }
        return $submenu_file;
    }
    public function inject_global_layout_wrapper()
    {
        // We get the current screen to check if we are on a Surftrust page.
        $screen = get_current_screen();
        $is_surftrust_page = (strpos($screen->id, 'surftrust') !== false);

        if ($is_surftrust_page) {
            echo '<div id="surftrust-sidebar-root"></div>'; // Root for our React Sidebar
            echo '<div class="surftrust-content-wrapper">'; // Wrapper for the main WordPress content
        }
    }

    public function close_global_layout_wrapper()
    {
        $screen = get_current_screen();
        $is_surftrust_page = (strpos($screen->id, 'surftrust') !== false);

        if ($is_surftrust_page) {
            echo '</div>'; // Close the surftrust-content-wrapper
        }
    }
    // In class-surftrust-admin.php
    // In /surftrust/admin/class-surftrust-admin.php

    public function enqueue_scripts($hook_suffix)
    {
        $screen = get_current_screen();

        // --- Styles needed on ALL our pages ---
        // Check if the current page is our main SPA page OR the CPT screen
        if ($hook_suffix === 'toplevel_page_surftrust' || (is_object($screen) && $screen->post_type === 'st_notification')) {
            wp_enqueue_style('wp-components');
            wp_enqueue_style(
                'surftrust-admin-styles',
                plugin_dir_url(__FILE__) . 'css/surftrust-admin.css',
                array(),
                $this->version
            );
        }

        // --- Logic for our MAIN SPA (Dashboard, Settings, Analytics) ---
        if ($hook_suffix === 'toplevel_page_surftrust') {
            $handle = 'surftrust-main-app';
            wp_enqueue_script(
                $handle,
                plugin_dir_url(__FILE__) . '../build/app.js',
                ['wp-element', 'wp-api-fetch', 'wp-components'],
                filemtime(plugin_dir_path(__FILE__) . '../build/app.js'),
                true
            );
            wp_localize_script($handle, 'surftrust_admin_data', [
                'nonce' => wp_create_nonce('wp_rest'),
                'plugin_url' => plugin_dir_url(dirname(__FILE__)),
            ]);
        }

        // --- Logic for our BUILDER APP (Add New / Edit Notification screens) ---
        if (is_object($screen) && $screen->post_type === 'st_notification') {
            $handle = 'surftrust-builder-app';
            wp_enqueue_script(
                $handle,
                plugin_dir_url(__FILE__) . '../build/builder.js',
                ['wp-element', 'wp-api-fetch', 'wp-components'],
                filemtime(plugin_dir_path(__FILE__) . '../build/builder.js'),
                true
            );

            global $post;
            $saved_settings = get_post_meta($post->ID, '_surftrust_settings', true);
            wp_localize_script($handle, 'surftrust_admin_data', [
                'nonce' => wp_create_nonce('wp_rest'),
                'plugin_url' => plugin_dir_url(dirname(__FILE__)),
                'settings' => is_array($saved_settings) ? $saved_settings : new stdClass(),
            ]);
        }
    }
};
