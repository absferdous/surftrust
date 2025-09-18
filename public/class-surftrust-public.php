<?php
class Surftrust_Public
{
    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function enqueue_scripts()
    {
        // Register our main public script
        wp_enqueue_script(
            $this->plugin_name . '-public',
            plugin_dir_url(__FILE__) . '../build/public.js',
            array(), // No dependencies for now
            $this->version,
            true // Load in footer
        );
        wp_enqueue_style(
            $this->plugin_name . '-public',
            plugin_dir_url(__FILE__) . 'css/surftrust-public.css',
            array(),
            $this->version
        );

        // Fetch ALL our settings from the database
        global $wpdb;
        $table_name = $wpdb->prefix . 'surftrust_settings';
        $results = $wpdb->get_results("SELECT setting_name, setting_value FROM $table_name");
        $settings = array();
        foreach ($results as $row) {
            $settings[$row->setting_name] = json_decode($row->setting_value, true);
        }

        // Pass the settings and API info to our script
        wp_localize_script(
            $this->plugin_name . '-public',
            'surftrust_data', // This becomes a global JS object
            array(
                'settings' => $settings,
                'api_url'  => untrailingslashit(rest_url('surftrust/v1')),
            )
        );
    }
}
