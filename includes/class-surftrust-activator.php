<?php

/**
 * Fired during plugin activation.
 *
 * @package    Surftrust
 * @subpackage Surftrust/includes
 */
class Surftrust_Activator
{

    /**
     * Main activation method. Runs both table creation functions.
     */
    public static function activate()
    {
        self::create_settings_table();
        self::create_analytics_table();
    }

    /**
     * Create the custom database table for settings.
     */
    private static function create_settings_table()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'surftrust_settings';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            setting_name varchar(255) NOT NULL,
            setting_value longtext NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY setting_name (setting_name)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Create the custom database table for analytics.
     */
    private static function create_analytics_table()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'surftrust_analytics';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id BIGINT(20) NOT NULL AUTO_INCREMENT,
            event_type VARCHAR(10) NOT NULL,
            notification_type VARCHAR(20) NOT NULL,
            product_id BIGINT(20) UNSIGNED DEFAULT 0,
            timestamp DATETIME NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}
