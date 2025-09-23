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

    public function add_admin_menu()
    {
        // --- 1. Manually Create the Top-Level Menu ---
        // We are creating a top-level page that will act as our Dashboard.
        add_menu_page(
            'Surftrust Dashboard',      // Page title
            'Surftrust',                // Menu title
            'manage_options',           // Capability
            'surftrust',                // The parent menu slug. THIS MUST MATCH the 'show_in_menu' value from the CPT.
            array($this, 'display_dashboard_page'), // Callback for the Dashboard page
            'dashicons-bell',           // Icon
            30
        );

        // --- 2. Manually Re-add the "All Notifications" and "Add New" links ---
        // We are essentially recreating the links that the CPT would normally make.
        add_submenu_page(
            'surftrust', // Parent slug
            'All Notifications',
            'All Notifications',
            'manage_options',
            'edit.php?post_type=surftrust_notification' // This is the standard WordPress link
        );

        add_submenu_page(
            'surftrust', // Parent slug
            'Add New Notification',
            'Add New',
            'manage_options',
            'post-new.php?post_type=surftrust_notification' // This is the standard WordPress link
        );

        // --- 3. Add our Custom Pages ---
        add_submenu_page(
            'surftrust', // Parent slug
            'Settings',
            'Settings',
            'manage_options',
            'surftrust-settings', // Unique slug
            array($this, 'display_settings_page')
        );

        add_submenu_page(
            'surftrust', // Parent slug
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

    public function enqueue_scripts($hook_suffix)
    {
        // --- 1. Define our NEW, CORRECT page hooks ---
        $dashboard_page_hook = 'toplevel_page_surftrust';
        $settings_page_hook  = 'surftrust_page_surftrust-settings';
        $analytics_page_hook = 'surftrust_page_surftrust-analytics';

        // An array of all our custom page hooks
        $surftrust_pages = [$dashboard_page_hook, $settings_page_hook, $analytics_page_hook];

        // --- 2. Check if we are on any of our pages. If not, exit early. ---
        if (! in_array($hook_suffix, $surftrust_pages)) {
            return;
        }

        // --- 3. Enqueue common styles needed on ALL our pages ---
        wp_enqueue_style('wp-components');
        wp_enqueue_style(
            'surftrust-admin-styles',
            plugin_dir_url(__FILE__) . 'css/surftrust-admin.css',
            array(),
            $this->version
        );

        // --- 4. Logic for the Dashboard Page ---
        if ($hook_suffix === $dashboard_page_hook) {
            $script_handle = 'surftrust-dashboard-app';
            wp_enqueue_script(
                $script_handle,
                plugin_dir_url(__FILE__) . '../build/dashboard.js', // We will create this JS file next
                array('wp-element', 'wp-api-fetch', 'wp-components'),
                filemtime(plugin_dir_path(__FILE__) . '../build/dashboard.js'),
                true
            );
            wp_localize_script($script_handle, 'surftrust_admin_data', array('nonce' => wp_create_nonce('wp_rest')));
        }

        // --- 5. Logic for the Settings Page ---
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

        // --- 6. Logic for the Analytics Page ---
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
    }
};
