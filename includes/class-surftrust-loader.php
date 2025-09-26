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

    // In /surftrust/includes/class-surftrust-loader.php

    public function __construct()
    {
        if (defined('SURFTRUST_VERSION')) {
            $this->version = SURFTRUST_VERSION;
        } else {
            $this->version = '1.0.0';
        }
        $this->plugin_name = 'surftrust';

        // The constructor now ONLY loads files. It does not add any hooks.
        $this->load_dependencies();
    }

    /**
     * Register all of the hooks related to the plugin.
     * This method is called by the main plugin file.
     */
    public function run()
    {
        // This is now the safe place to add all our hooks.
        $this->define_cpt_hooks();
        $this->define_admin_hooks();
        $this->define_api_hooks();
        $this->define_public_hooks();
    }
    // In /surftrust/includes/class-surftrust-loader.php (add this new method)

    private function define_cpt_hooks()
    {
        // This ensures the CPT is registered at the right time.
        $plugin_cpt = new Surftrust_CPT();
        // Note: The action is inside the Surftrust_CPT constructor, so we just need to instantiate it.
    }
    private function load_dependencies()
    {
        // Admin-related files

        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/class-surftrust-cpt.php';
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'admin/class-surftrust-admin.php';
        // API-related files
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/api/class-surftrust-api-manager.php';
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'public/class-surftrust-public.php';
        require_once SURFTRUST_PLUGIN_DIR_PATH . 'admin/class-surftrust-metabox.php';
    }

    private function define_admin_hooks()
    {
        $plugin_admin = new Surftrust_Admin($this->plugin_name, $this->version);
        new Surftrust_Metabox();

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
}
