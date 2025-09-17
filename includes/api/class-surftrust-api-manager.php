<?php

/**
 * Manages the registration of REST API routes.
 *
 * @package Surftrust
 * @subpackage Surftrust/includes/api
 */
class Surftrust_Api_Manager
{

    /**
     * Register all REST API routes for the plugin.
     */
    public function register_routes()
    {
        // Debugging: Require the controller classes that contain the callback logic.
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/api/class-surftrust-settings-controller.php';


        $settings_controller = new Surftrust_Settings_Controller();
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/api/class-surftrust-public-controller.php';
        $public_controller = new Surftrust_Public_Controller();

        // Debugging: Register the route for getting and saving settings.
        // The namespace 'surftrust/v1' keeps our routes organized.
        register_rest_route('surftrust/v1', '/settings', array(
            // Route for GET requests
            array(
                'methods'             => WP_REST_Server::READABLE, // This corresponds to a GET request
                'callback'            => array($settings_controller, 'get_settings'),
                'permission_callback' => array($this, 'admin_permissions_check'),
            ),
            // Route for POST requests
            array(
                'methods'             => WP_REST_Server::CREATABLE, // This corresponds to a POST request
                'callback'            => array($settings_controller, 'save_settings'),
                'permission_callback' => array($this, 'admin_permissions_check'),
            ),
        ));
        // Endpoint to get all data needed for notifications
        register_rest_route('surftrust/v1', '/public/data', array(
            'methods'  => WP_REST_Server::READABLE,
            'callback' => array($public_controller, 'get_notification_data'),
            'permission_callback' => '__return_true', // Publicly accessible
        ));
        // Endpoint to track a "view" event
        register_rest_route('surftrust/v1', '/track/view', array(
            'methods'  => WP_REST_Server::CREATABLE, // POST request
            'callback' => array($public_controller, 'track_view'),
            'permission_callback' => '__return_true',
        ));
        // Endpoint to track a "click" event
        register_rest_route('surftrust/v1', '/track/click', array(
            'methods'  => WP_REST_Server::CREATABLE, // POST request
            'callback' => array($public_controller, 'track_click'),
            'permission_callback' => '__return_true',
        ));
    }

    /**
     * Permission check callback for admin-only routes.
     *
     * @return bool True if the user has the 'manage_options' capability, false otherwise.
     */
    public function admin_permissions_check()
    {
        // Debugging: This is a crucial security check. Only users who can manage options (admins) can access these endpoints.
        return current_user_can('manage_options');
    }
}
