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
    public function add_admin_menu()
    {
        error_log('add admin menu loaded');
        add_menu_page(
            'Surftrust Settings',
            'Surftrust',
            'manage_options',
            'surftrust',
            array($this, 'display_admin_page'),
            'dashicons-bell',
            30
        );
    }

    /**
     * Render the basic HTML structure for the admin page.
     * The React app will mount onto the 'surftrust-admin-app' div.
     */
    public function display_admin_page()
    {
        error_log('display_admin_page loaded');
        // This is the function that is likely failing.
        echo '<div class="wrap"><div id="surftrust-admin-app"></div></div>';
    }

    /**
     * Enqueue scripts and styles for the admin area.
     */
    // In /surftrust/admin/class-surftrust-admin.php
    public function enqueue_scripts($hook)
    {
        if ('toplevel_page_surftrust' !== $hook) {
            return;
        }

        // Enqueue the WordPress components stylesheet
        wp_enqueue_style('wp-components');

        // --- ADD THIS LINE ---
        // Enqueue our custom admin stylesheet
        wp_enqueue_style(
            'surftrust-admin-styles',
            plugin_dir_url(__FILE__) . 'css/surftrust-admin.css',
            array(), // No dependencies
            $this->version
        );
        // --- END ADDITION ---

        $script_handle = 'surftrust-admin-app-script';
        // Add 'wp-components' to the dependency array for our script
        wp_enqueue_script(
            'surftrust-admin-app-script',
            plugin_dir_url(__FILE__) . '../build/index.js',
            array('wp-element', 'wp-api-fetch', 'wp-components'),
            filemtime(plugin_dir_path(__FILE__) . '../build/index.js'),
            true
        );
        wp_localize_script(
            $script_handle,
            'surftrust_admin_data', // The name of our new JS object
            array(
                // Create a nonce with a specific name for our API
                'nonce' => wp_create_nonce('wp_rest')
            )
        );
    }
}
