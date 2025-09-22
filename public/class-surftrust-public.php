<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @package    Surftrust
 * @subpackage Surftrust/public
 */
class Surftrust_Public
{

    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Register the stylesheets and scripts for the public-facing side of the site.
     */
    public function enqueue_scripts()
    {
        wp_enqueue_style(
            $this->plugin_name,
            plugin_dir_url(__FILE__) . 'css/surftrust-public.css',
            array(),
            $this->version,
            'all'
        );

        wp_enqueue_script(
            $this->plugin_name,
            plugin_dir_url(__FILE__) . '../build/public.js',
            array(),
            $this->version,
            true
        );

        global $wpdb;
        $table_name = $wpdb->prefix . 'surftrust_settings';
        $results = $wpdb->get_results("SELECT setting_name, setting_value FROM $table_name");
        $settings = array();
        foreach ($results as $row) {
            $settings[$row->setting_name] = json_decode($row->setting_value, true);
        }

        wp_localize_script(
            $this->plugin_name,
            'surftrust_data',
            array(
                'settings' => $settings,
                'api_url'  => untrailingslashit(rest_url('surftrust/v1')),
            )
        );
    }
}
