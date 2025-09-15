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
    public function enqueue_scripts($hook)
    {
        error_log('enqueue_scripts loaded');

        if ('toplevel_page_surftrust' !== $hook) {
            return;
        }

        // Use the plugin URL constant to get the correct path
        wp_enqueue_script(
            'surftrust-admin-app-script',
            plugin_dir_url(__FILE__) . '../build/index.js', // CHANGED PATH
            array('wp-element', 'wp-api-fetch'),
            filemtime(plugin_dir_path(__FILE__) . '../build/index.js'), // Auto-versioning
            true
        );

        // For debugging, log the URL being used
        error_log('Loading script from: ' . SURFTRUST_PLUGIN_URL . 'admin/js/surftrust-admin-bundle.js');
    }
}
