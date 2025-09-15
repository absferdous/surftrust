<?php

/**
 * Fired during plugin activation.
 *
 * @link       https://yourwebsite.com
 * @since      1.0.0
 * @package    Surftrust
 * @subpackage Surftrust/includes
 */
class Surftrust_Activator
{

    /**
     * Main activation method.
     *
     * @since    1.0.0
     */
    public static function activate()
    {
        // Debugging: Call the method to create the custom database table.
        self::create_settings_table();
    }

    /**
     * Create the custom database table for settings.
     */
    private static function create_settings_table()
    {
        global $wpdb;
        // Debugging: Define the table name using the WordPress database prefix.
        $table_name = $wpdb->prefix . 'surftrust_settings';
        $charset_collate = $wpdb->get_charset_collate();

        // Debugging: The SQL statement for creating our table.
        // `setting_name` will be our key (e.g., 'sales_notification_color').
        // `setting_value` will store the configuration.
        $sql = "CREATE TABLE $table_name (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			setting_name varchar(255) NOT NULL,
			setting_value longtext NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY setting_name (setting_name)
		) $charset_collate;";

        // Debugging: We need dbDelta to intelligently create/update the table.
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}



#### **3. Plugin Deactivator (`/surftrust/includes/class-surftrust-deactivator.php`)**

// This file contains logic for plugin deactivation. For now, it's a placeholder, as we generally don't want to delete user settings on deactivation.

/**
 * Fired during plugin deactivation.
 *
 * @link       https://yourwebsite.com
 * @since      1.0.0
 * @package    Surftrust
 * @subpackage Surftrust/includes
 */
class Surftrust_Deactivator
{
    /**
     * Main deactivation method.
     *
     * @since    1.0.0
     */
    public static function deactivate()
    {
        // Debugging: This is where you would put cleanup code.
        // For example, flushing rewrite rules. We are intentionally
        // not deleting the custom table or settings, so the user's
        // configuration is preserved if they reactivate.
    }
}
