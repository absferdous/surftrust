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

    // In class-surftrust-admin.php
    // In /admin/class-surftrust-admin.php


    public function add_admin_menu()
    {
        add_menu_page('SurfPop', 'SurfPop', 'manage_options', 'surftrust', array($this, 'display_main_app_page'), 'dashicons-bell', 30);

        // ALL SPA submenu items MUST use the parent slug 'surftrust'.
        // This tells WordPress they are all the SAME page.
        add_submenu_page('surftrust', 'Dashboard', 'Dashboard', 'manage_options', 'surftrust', array($this, 'display_main_app_page'));
        add_submenu_page('surftrust', 'All Notifications', 'All Notifications', 'manage_options', 'surftrust', array($this, 'display_main_app_page'));
        add_submenu_page('surftrust', 'Settings', 'Settings', 'manage_options', 'surftrust', array($this, 'display_main_app_page'));
        add_submenu_page('surftrust', 'Analytics', 'Analytics', 'manage_options', 'surftrust', array($this, 'display_main_app_page'));

        // The "Add New" link is external and remains unchanged. This is correct.
        add_submenu_page('surftrust', 'Add New', 'Add New', 'manage_options', 'post-new.php?post_type=st_notification');
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
    // In /admin/class-surftrust-admin.php

    /**
     * Rewrites the submenu URLs to work with the React HashRouter.
     * This function finds our plugin's submenu items and changes their links
     * to include the '#' hash needed by the React SPA.
     

    /**
     * Rewrites the submenu URLs to add the correct hash for the React Router.
     */
    // In /admin/class-surftrust-admin.php

    /**
     * Rewrites the submenu URLs to add the correct hash for the React Router.
     * This version uses admin_url() to guarantee the base URL is always correct.
     */
    // In /admin/class-surftrust-admin.php

    // In /admin/class-surftrust-admin.php

    // In /admin/class-surftrust-admin.php

    public function modify_submenu_urls()
    {
        global $submenu;
        $parent_slug = 'surftrust';

        if (!isset($submenu[$parent_slug])) {
            return;
        }

        // Map the unique MENU TITLE to our React Router paths.
        $title_to_hash_map = [
            'Dashboard'         => '#/dashboard',
            'All Notifications' => '#/all-notifications',
            'Settings'          => '#/settings',
            'Analytics'         => '#/analytics',
        ];

        foreach ($submenu[$parent_slug] as $key => $item) {
            $menu_title = $item[0];
            if (isset($title_to_hash_map[$menu_title])) {
                // Append the hash directly to the parent slug.
                // The final link becomes: admin.php?page=surftrust#/settings
                $submenu[$parent_slug][$key][2] = 'admin.php?page=' . $parent_slug . $title_to_hash_map[$menu_title];
            }
        }
    }

    // In /surftrust/admin/class-surftrust-admin.php

    // public function redirect_all_notifications_link($submenu_file)
    // {
    //     global $submenu;

    //     // The parent slug is 'surftrust'
    //     // The original CPT link is 'edit.php?post_type=st_notification'
    //     if (isset($submenu['surftrust'])) {
    //         foreach ($submenu['surftrust'] as $key => $item) {
    //             if ($item[2] === 'edit.php?post_type=st_notification') {
    //                 // We found the original link, now change its destination slug
    //                 $submenu['surftrust'][$key][2] = 'surftrust-all-notifications';
    //             }
    //         }
    //     }
    //     return $submenu_file;
    // }


    /**
     * Adds a "Back" link at the top of the "Add New" and "Edit" screens for our CPT.
     * This provides a clear exit path for the user, taking them to the previous page.
     */
    public function add_cpt_back_button($post)
    {
        // Only show this button on our specific custom post type screen
        if ('st_notification' !== $post->post_type) {
            return;
        }

        // 1. Get the URL of the previous page from the server variables.
        $referrer = wp_get_referer();

        // 2. Define a safe fallback URL in case the referrer is not available.
        $fallback_url = admin_url('admin.php?page=surftrust#/all-notifications');

        // 3. Decide which URL to use. If the referrer is a valid admin URL, use it.
        //    Otherwise, use our fallback.
        $back_url = ($referrer && strpos($referrer, 'wp-admin')) ? $referrer : $fallback_url;

        // 4. Echo the HTML for the button.
        echo '<div class="surftrust-page-header">';
        echo '  <a href="' . esc_url($back_url) . '" class="surftrust-page-back-link">';
        echo '      <span class="dashicons dashicons-arrow-left-alt"></span> Back';
        echo '  </a>';
        echo '</div>';
    }
    

    public function enqueue_scripts($hook_suffix)
    {
        $screen = get_current_screen();

        // We only need to check for the ONE top-level hook for our SPA.
        $is_our_spa_page = ($hook_suffix === 'toplevel_page_surftrust');
        $is_our_builder_page = (is_object($screen) && $screen->post_type === 'st_notification');

        // Load styles on ANY of our plugin's pages.
        if ($is_our_spa_page || $is_our_builder_page) {
            wp_enqueue_style('wp-components');
            wp_enqueue_style('surftrust-admin-styles', plugin_dir_url(__FILE__) . 'css/surftrust-admin.css', array(), $this->version);
        }

        // Load the MAIN SPA SCRIPT only when we are on our SPA's page.
        if ($is_our_spa_page) {
            $handle = 'surftrust-main-app';
            wp_enqueue_script($handle, plugin_dir_url(__FILE__) . '../build/app.js', ['wp-element', 'wp-api-fetch', 'wp-components'], filemtime(plugin_dir_path(__FILE__) . '../build/app.js'), true);
            wp_localize_script($handle, 'surftrust_admin_data', ['nonce' => wp_create_nonce('wp_rest'), 'plugin_url' => plugin_dir_url(dirname(__FILE__))]);
        }

        // Load the BUILDER APP SCRIPT only on the CPT edit screen.
        if ($is_our_builder_page) {
            $handle = 'surftrust-builder-app';
            wp_enqueue_script($handle, plugin_dir_url(__FILE__) . '../build/builder.js', ['wp-element', 'wp-api-fetch', 'wp-components'], filemtime(plugin_dir_path(__FILE__) . '../build/builder.js'), true);
            global $post;
            $saved_settings = get_post_meta($post->ID, '_surftrust_settings', true);
            wp_localize_script($handle, 'surftrust_admin_data', ['nonce' => wp_create_nonce('wp_rest'), 'plugin_url' => plugin_dir_url(dirname(__FILE__)), 'settings' => is_array($saved_settings) ? $saved_settings : new stdClass(), 'all_notifications_url' => admin_url('admin.php?page=surftrust#/all-notifications')]);
        }
    }
};
