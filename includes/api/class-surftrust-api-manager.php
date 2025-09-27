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
    // In /surftrust/includes/api/class-surftrust-api-manager.php

    public function register_routes()
    {
        // --- 1. SETTINGS CONTROLLER (Admin) ---
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/api/class-surftrust-settings-controller.php';
        $settings_controller = new Surftrust_Settings_Controller();

        register_rest_route('surftrust/v1', '/settings', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($settings_controller, 'get_settings'),
                'permission_callback' => array($this, 'admin_permissions_check'),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($settings_controller, 'save_settings'),
                'permission_callback' => array($this, 'admin_permissions_check'),
            ),
        ));

        // --- 2. PUBLIC CONTROLLER (Public Data) ---
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/api/class-surftrust-public-controller.php';
        $public_controller = new Surftrust_Public_Controller();

        register_rest_route('surftrust/v1', '/public/data', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array($public_controller, 'get_notification_data'),
            'permission_callback' => '__return_true',
        ));

        // --- 3. ANALYTICS CONTROLLER (Admin Dashboard & Public Tracking) ---
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/api/class-surftrust-analytics-controller.php';
        $analytics_controller = new Surftrust_Analytics_Controller();

        register_rest_route('surftrust/v1', '/analytics', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array($analytics_controller, 'get_analytics_data'),
            'permission_callback' => array($this, 'admin_permissions_check'),
        ));

        // --- THIS IS THE CRITICAL FIX ---
        // These routes must point to the $analytics_controller where the methods now live.
        register_rest_route('surftrust/v1', '/track/view', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array($analytics_controller, 'track_view'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route('surftrust/v1', '/track/click', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array($analytics_controller, 'track_click'),
            'permission_callback' => '__return_true',
        ));
        // notifucations controller
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/api/class-surftrust-notifications-controller.php';
        $notifications_controller = new Surftrust_Notifications_Controller();
        // Register the main "Get Notifications" endpoint
        register_rest_route('surftrust/v1', '/notifications', array(
            'methods'  => WP_REST_Server::READABLE, // This is a GET request
            'callback' => array($notifications_controller, 'get_notifications'),
            'permission_callback' => array($this, 'admin_permissions_check'), // Secure: admin only
        ));
        register_rest_route('surftrust/v1', '/notifications/(?P<id>\\d+)/toggle', array(
            'methods'  => WP_REST_Server::CREATABLE, // This is a POST request
            'callback' => array($notifications_controller, 'toggle_notification_status'),
            'permission_callback' => array($this, 'admin_permissions_check'),
        ));
        // Register the "Duplicate" endpoint
        register_rest_route('surftrust/v1', '/notifications/(?P<id>\\d+)/duplicate', array(
            'methods'  => WP_REST_Server::CREATABLE, // This is a POST request
            'callback' => array($notifications_controller, 'duplicate_notification'),
            'permission_callback' => array($this, 'admin_permissions_check'),
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
