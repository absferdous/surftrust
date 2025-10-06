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
        $customize_json = $wpdb->get_var("SELECT setting_value FROM $table_name WHERE setting_name = 'customize'");
        $customize_settings = json_decode($customize_json, true);
        $current_id = 0;
        if (is_singular()) $current_id = get_the_ID();
        if (is_front_page()) $current_id = (int) get_option('page_on_front');
        if (function_exists('is_shop') && is_shop()) $current_id = (int) get_option('woocommerce_shop_page_id');

        wp_localize_script(
            $this->plugin_name,
            'surftrust_globals',
            array(
                'customize' => $customize_settings ?: [],
                'api_url'  => untrailingslashit(rest_url('surftrust/v1')),
                'plugin_url' => plugin_dir_url(dirname(__FILE__)),
                'current_page_id' => $current_id,
            )
        );
    }
}
