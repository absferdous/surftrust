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

    public function add_admin_menu()
    {
        // 1. Create the Top-Level Menu.
        // We give it a unique slug and make its default page the "All Notifications" list.
        add_menu_page(
            'Surftrust',
            'Surftrust',
            'manage_options',
            'surftrust', // The main parent slug
            // The callback for the top-level item will be the "All Notifications" CPT list.
            // We achieve this by redirecting in a cleaner way. Let's make it the dashboard.
            array($this, 'display_dashboard_page'),
            'dashicons-bell',
            30
        );

        // 2. Add the Dashboard as the FIRST sub-menu item.
        // By giving it the SAME slug as the parent, it becomes the default page
        // when a user clicks the top-level "Surftrust" link.
        add_submenu_page(
            'surftrust',           // Parent slug
            'Dashboard',           // Page title
            'Dashboard',           // Menu title
            'manage_options',
            'surftrust',           // Use parent slug to make it the default
            array($this, 'display_dashboard_page')
        );

        // 3. Add Settings and Analytics as additional sub-menus.
        add_submenu_page(
            'surftrust',
            'Settings',
            'Settings',
            'manage_options',
            'surftrust-settings',
            array($this, 'display_settings_page')
        );

        add_submenu_page(
            'surftrust',
            'Analytics',
            'Analytics',
            'manage_options',
            'surftrust-analytics',
            array($this, 'display_analytics_page')
        );
        add_submenu_page(
            'surftrust',                       // <-- The key change is here
            'All Notifications',        // Page title
            'All Notifications',        // Menu title (doesn't matter as it's hidden)
            'manage_options',
            'surftrust-all-notifications', // The slug our filter redirects to
            array($this, 'display_all_notifications_page')
        );
    }
    /**
     * Render the basic HTML structure for the admin page.
     * The React app will mount onto the 'surftrust-admin-app' div.
     */
    /**
     * Renders the root div for the main Settings React application.
     */
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
    public function enqueue_scripts($hook_suffix)
    {
        // Get the current screen information at the top
        $screen = get_current_screen();

        // Define all of our unique page hooks
        $dashboard_page_hook   = 'toplevel_page_surftrust';
        $all_notifs_page_hook  = 'surftrust_page_surftrust-all-notifications';
        $settings_page_hook    = 'surftrust_page_surftrust-settings';
        $analytics_page_hook   = 'surftrust_page_surftrust-analytics';

        // An array of our react-based page hooks
        $react_pages = [$dashboard_page_hook, $all_notifs_page_hook, $settings_page_hook, $analytics_page_hook];

        // Check if we are on any of our app pages OR the CPT edit screen.
        if (in_array($hook_suffix, $react_pages) || (is_object($screen) && $screen->post_type === 'st_notification')) {
            // Enqueue common styles needed on all our pages
            wp_enqueue_style('wp-components');
            wp_enqueue_style(
                'surftrust-admin-styles',
                plugin_dir_url(__FILE__) . 'css/surftrust-admin.css',
                array(),
                $this->version
            );
        }

        // --- Centralized data for wp_localize_script ---
        // This array will be passed to all admin scripts.
        $localized_data = array(
            'nonce' => wp_create_nonce('wp_rest'),
            'plugin_url' => plugin_dir_url(dirname(__FILE__)), // Provides the root plugin URL
        );

        // --- Logic for the Dashboard Page ---
        if ($hook_suffix === $dashboard_page_hook) {
            $script_handle = 'surftrust-dashboard-app';
            wp_enqueue_script($script_handle, plugin_dir_url(__FILE__) . '../build/dashboard.js', array('wp-element', 'wp-api-fetch', 'wp-components'), filemtime(plugin_dir_path(__FILE__) . '../build/dashboard.js'), true);
            wp_localize_script($script_handle, 'surftrust_admin_data', $localized_data);
        }

        // --- Logic for the Settings Page ---
        if ($hook_suffix === $settings_page_hook) {
            $script_handle = 'surftrust-settings-app';
            wp_enqueue_script($script_handle, plugin_dir_url(__FILE__) . '../build/settings.js', array('wp-element', 'wp-api-fetch', 'wp-components'), filemtime(plugin_dir_path(__FILE__) . '../build/settings.js'), true);
            wp_localize_script($script_handle, 'surftrust_admin_data', $localized_data);
        }

        // --- Logic for the Analytics Page ---
        if ($hook_suffix === $analytics_page_hook) {
            $script_handle = 'surftrust-analytics-app';
            wp_enqueue_script($script_handle, plugin_dir_url(__FILE__) . '../build/analytics.js', array('wp-element', 'wp-api-fetch', 'wp-components'), filemtime(plugin_dir_path(__FILE__) . '../build/analytics.js'), true);
            wp_localize_script($script_handle, 'surftrust_admin_data', $localized_data);
        }

        // --- Logic for the All Notifications Page ---
        if ($hook_suffix === $all_notifs_page_hook) {
            $script_handle = 'surftrust-all-notifications-app';
            wp_enqueue_script($script_handle, plugin_dir_url(__FILE__) . '../build/all_notifications.js', array('wp-element', 'wp-api-fetch', 'wp-components'), filemtime(plugin_dir_path(__FILE__) . '../build/all_notifications.js'), true);
            wp_localize_script($script_handle, 'surftrust_admin_data', $localized_data);
        }

        // --- Logic for the "Add New" / "Edit Notification" Builder Page ---
        if (is_object($screen) && $screen->post_type === 'st_notification') {
            global $post;
            $saved_settings = get_post_meta($post->ID, '_surftrust_settings', true);

            // Add the saved settings specifically for the builder
            $builder_data = array_merge($localized_data, array(
                'settings' => is_array($saved_settings) ? $saved_settings : new stdClass(),
            ));

            $script_handle = 'surftrust-builder-app';
            wp_enqueue_script($script_handle, plugin_dir_url(__FILE__) . '../build/builder.js', array('wp-element', 'wp-api-fetch', 'wp-components'), filemtime(plugin_dir_path(__FILE__) . '../build/builder.js'), true);
            wp_localize_script($script_handle, 'surftrust_admin_data', $builder_data);
        }
    }
};
