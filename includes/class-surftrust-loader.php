<?php

/**
 * The core plugin class.
 *
 * @since      1.0.0
 * @package    Surftrust
 * @subpackage Surftrust/includes
 */
class Surftrust_Loader
{

    protected $actions;
    protected $filters;
    protected $version;
    protected $plugin_name;

    public function __construct()
    {
        if (defined('SURFTRUST_VERSION')) {
            $this->version = SURFTRUST_VERSION;
        } else {
            $this->version = '1.0.0';
        }
        $this->plugin_name = 'surftrust';

        // Debugging: Load all necessary class files immediately.
        $this->load_dependencies();
        // Debugging: Define all hooks that need to be registered.
        $this->define_admin_hooks();
        $this->define_api_hooks();
        $this->define_public_hooks();
    }

    private function load_dependencies()
    {
        // Admin-related files
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'admin/class-surftrust-admin.php';
        // API-related files
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/api/class-surftrust-api-manager.php';
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'public/class-surftrust-public.php';
    }

    private function define_admin_hooks()
    {
        $plugin_admin = new Surftrust_Admin($this->plugin_name, $this->version);

        // Debugging: Add an action to create the admin menu page.
        add_action('admin_menu', array($plugin_admin, 'add_admin_menu'));
        // Debugging: Add an action to enqueue our admin scripts and styles.
        add_action('admin_enqueue_scripts', array($plugin_admin, 'enqueue_scripts'));
    }

    private function define_api_hooks()
    {
        $api_manager = new Surftrust_Api_Manager();

        // Debugging: The 'rest_api_init' hook is the correct place to register custom REST API routes.
        add_action('rest_api_init', array($api_manager, 'register_routes'));
    }

    /**
     * This method is a placeholder for where you would register public-facing hooks.
     * We will implement this more fully later.
     */
    private function define_public_hooks()
    {
        $plugin_public = new Surftrust_Public($this->plugin_name, $this->version);
        // The 'wp_enqueue_scripts' hook is for the PUBLIC side of the site.
        add_action('wp_enqueue_scripts', array($plugin_public, 'enqueue_scripts'));
    }
    public function run()
    {
        // This class doesn't need a run method since hooks are registered directly
        // in the constructor's helper methods. This demonstrates the completed wiring.
    }
}
