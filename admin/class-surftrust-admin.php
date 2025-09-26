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

    public function add_admin_menu()
    {
        // 1. Create the Top-Level Menu, which IS the Dashboard page.
        add_menu_page(
            'Surftrust Dashboard',
            'Surftrust',
            'manage_options',
            'surftrust-dashboard', // Use the dashboard slug as the main slug
            array($this, 'display_dashboard_page'),
            'dashicons-bell',
            30
        );

        // 2. Add "All Notifications" and "Add New" under the CPT's menu parent.
        // This links them to the CPT, but they will appear under our main menu.
        // We do this by setting 'show_in_menu' in the CPT file.

        // 3. Add our other pages as sub-menus to the Dashboard.
        add_submenu_page(
            'surftrust-dashboard', // Parent is now the dashboard
            'Settings',
            'Settings',
            'manage_options',
            'surftrust-settings',
            array($this, 'display_settings_page')
        );

        add_submenu_page(
            'surftrust-dashboard', // Parent is now the dashboard
            'Analytics',
            'Analytics',
            'manage_options',
            'surftrust-analytics',
            array($this, 'display_analytics_page')
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

    public function enqueue_scripts($hook_suffix)
    {
        // Get the current screen information at the top
        $screen = get_current_screen();

        // Define all of our unique page hooks
        $dashboard_page_hook = 'toplevel_page_surftrust';
        $settings_page_hook  = 'surftrust_page_surftrust-settings';
        $analytics_page_hook = 'surftrust_page_surftrust-analytics';

        // An array of our sub-menu page hooks for easy checking
        $surftrust_pages = [$dashboard_page_hook, $settings_page_hook, $analytics_page_hook];

        // First, check if we are on any of our pages OR the CPT edit screen.
        // If we are, we know we need to load our common stylesheets.
        if (in_array($hook_suffix, $surftrust_pages) || (is_object($screen) && $screen->post_type === 'st_notification')) {
            wp_enqueue_style('wp-components');
            wp_enqueue_style(
                'surftrust-admin-styles',
                plugin_dir_url(__FILE__) . 'css/surftrust-admin.css',
                array(),
                $this->version
            );
        }

        // --- Logic for the Dashboard Page ---
        if ($hook_suffix === $dashboard_page_hook) {
            $script_handle = 'surftrust-dashboard-app';
            wp_enqueue_script(
                $script_handle,
                plugin_dir_url(__FILE__) . '../build/dashboard.js',
                array('wp-element', 'wp-api-fetch', 'wp-components'),
                filemtime(plugin_dir_path(__FILE__) . '../build/dashboard.js'),
                true
            );
            wp_localize_script($script_handle, 'surftrust_admin_data', array('nonce' => wp_create_nonce('wp_rest')));
        }

        // --- Logic for the Settings Page ---
        if ($hook_suffix === $settings_page_hook) {
            $script_handle = 'surftrust-settings-app';
            wp_enqueue_script(
                $script_handle,
                plugin_dir_url(__FILE__) . '../build/settings.js',
                array('wp-element', 'wp-api-fetch', 'wp-components'),
                filemtime(plugin_dir_path(__FILE__) . '../build/settings.js'),
                true
            );
            wp_localize_script($script_handle, 'surftrust_admin_data', array('nonce' => wp_create_nonce('wp_rest')));
        }

        // --- Logic for the Analytics Page ---
        if ($hook_suffix === $analytics_page_hook) {
            $script_handle = 'surftrust-analytics-app';
            wp_enqueue_script(
                $script_handle,
                plugin_dir_url(__FILE__) . '../build/analytics.js',
                array('wp-element', 'wp-api-fetch', 'wp-components'),
                filemtime(plugin_dir_path(__FILE__) . '../build/analytics.js'),
                true
            );
            wp_localize_script($script_handle, 'surftrust_admin_data', array('nonce' => wp_create_nonce('wp_rest')));
        }

        // --- THIS IS THE MISSING BLOCK ---
        // Logic for the "Add New" / "Edit Notification" Builder Page
        if (is_object($screen) && $screen->post_type === 'st_notification') {
            $script_handle = 'surftrust-builder-app';
            wp_enqueue_script(
                $script_handle,
                plugin_dir_url(__FILE__) . '../build/builder.js',
                array('wp-element', 'wp-api-fetch', 'wp-components'),
                filemtime(plugin_dir_path(__FILE__) . '../build/builder.js'),
                true
            );
            wp_localize_script($script_handle, 'surftrust_admin_data', array('nonce' => wp_create_nonce('wp_rest')));
        }
    }
};
