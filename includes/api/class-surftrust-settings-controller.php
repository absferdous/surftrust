<?php

/**
 * Controller for handling settings via the REST API.
 *
 * @package Surftrust
 * @subpackage Surftrust/includes/api
 */
class Surftrust_Settings_Controller
{

    /**
     * Retrieves all plugin settings.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object with settings data.
     */
    public function get_settings(WP_REST_Request $request)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'surftrust_settings';

        // Debugging: Query our custom table to get all settings.
        $results = $wpdb->get_results("SELECT setting_name, setting_value FROM $table_name");

        $settings = array();
        foreach ($results as $row) {
            // Debugging: Decode the value if it's JSON.
            $settings[$row->setting_name] = json_decode($row->setting_value, true);
        }

        return new WP_REST_Response($settings, 200);
    }

    /**
     * Saves plugin settings.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object with a success or error message.
     */
    public function save_settings(WP_REST_Request $request)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'surftrust_settings';

        // Debugging: Get the settings from the POST request body.
        $settings = $request->get_json_params();

        if (empty($settings)) {
            return new WP_REST_Response(array('message' => 'No settings provided.'), 400);
        }

        // Debugging: Loop through each setting and update or insert it into the database.
        foreach ($settings as $name => $value) {
            // Sanitize the key to prevent SQL injection.
            $sanitized_name = sanitize_key($name);
            // The value is an array/object, so we encode it as JSON. We'll rely on wpdb->prepare for safety.
            $json_value = wp_json_encode($value);

            $wpdb->query(
                $wpdb->prepare(
                    "INSERT INTO $table_name (setting_name, setting_value) VALUES (%s, %s)
                     ON DUPLICATE KEY UPDATE setting_value = %s",
                    $sanitized_name,
                    $json_value,
                    $json_value
                )
            );
        }

        return new WP_REST_Response(array('success' => true, 'message' => 'Settings saved.'), 200);
    }
}
