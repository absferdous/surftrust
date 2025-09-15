<?php

/**
 * The plugin bootstrap file
 *
 * @link              https://yourwebsite.com
 * @since             1.0.0
 * @package           Surftrust
 *
 * @wordpress-plugin
 * Plugin Name:       Surftrust
 * Plugin URI:        https://yourwebsite.com/surftrust
 * Description:       A modern, user-friendly notification plugin for WooCommerce.
 * Version:           1.0.0
 * Author:            surflab
 * Author URI:        https://yourwebsite.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       surftrust
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (! defined('WPINC')) {
    die;
}

// Debugging: Define plugin constants for easy access to paths and version.
define('SURFTRUST_VERSION', '1.0.0');
define('SURFTRUST_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('SURFTRUST_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-surftrust-activator.php
 */
function activate_surftrust()
{
    require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/class-surftrust-activator.php';
    Surftrust_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-surftrust-deactivator.php
 */
function deactivate_surftrust()
{
    require_once SURFTRUST_PLUGIN_DIR_PATH . 'includes/class-surftrust-deactivator.php';
    Surftrust_Deactivator::deactivate();
}

// Debugging: Register hooks to be called when the plugin is activated or deactivated.
register_activation_hook(__FILE__, 'activate_surftrust');
register_deactivation_hook(__FILE__, 'deactivate_surftrust');

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
require plugin_dir_path(__FILE__) . 'includes/class-surftrust-loader.php';

// Debugging: Instantiate the main loader class to get the plugin started.
function run_surftrust()
{
    $plugin = new Surftrust_Loader();
    $plugin->run();
}

run_surftrust();
