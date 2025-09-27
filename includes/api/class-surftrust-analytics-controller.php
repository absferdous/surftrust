<?php
class Surftrust_Analytics_Controller
{
    /**
     * Records a 'view' event in the analytics table.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response A success or error response.
     */


    /**
     * Records a 'click' event in the analytics table.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response A success or error response.
     */


    /**
     * Helper function to insert an event into the analytics database.
     *
     * @param string $event_type The type of event ('view' or 'click').
     * @param array  $params     The data sent with the request.
     * @return WP_REST_Response A success or error response.
     */

    public function get_analytics_data(WP_REST_Request $request)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'surftrust_analytics';

        // --- 1. Get Totals (same as before) ---
        $total_views = $wpdb->get_var("SELECT COUNT(id) FROM $table_name WHERE event_type = 'view'");
        $total_clicks = $wpdb->get_var("SELECT COUNT(id) FROM $table_name WHERE event_type = 'click'");
        $ctr = ($total_views > 0) ? round(($total_clicks / $total_views) * 100, 2) : 0;

        // --- 2. Get Chart Data for the Last 7 Days ---
        $chart_data = [];
        $today = new DateTime();
        $start_date = (new DateTime())->modify('-7 days');

        // Use a prepared statement for security and efficiency
        $daily_stats = $wpdb->get_results($wpdb->prepare(
            "SELECT DATE(timestamp) as date, event_type, COUNT(id) as count
            FROM $table_name
            WHERE timestamp >= %s
            GROUP BY DATE(timestamp), event_type
            ORDER BY date ASC",
            $start_date->format('Y-m-d H:i:s')
        ));

        // Initialize an array with all dates for the last 7 days
        $period = new DatePeriod($start_date, new DateInterval('P1D'), $today->modify('+1 day'));
        $dates = [];
        foreach ($period as $date) {
            $dates[$date->format('Y-m-d')] = ['views' => 0, 'clicks' => 0];
        }

        // Populate the array with our stats from the database
        foreach ($daily_stats as $stat) {
            if (isset($dates[$stat->date])) {
                if ($stat->event_type === 'view') {
                    $dates[$stat->date]['views'] = (int) $stat->count;
                } elseif ($stat->event_type === 'click') {
                    $dates[$stat->date]['clicks'] = (int) $stat->count;
                }
            }
        }

        // Format for Chart.js
        $chart_data = [
            'labels' => array_map(function ($date_str) {
                return date('M j', strtotime($date_str));
            }, array_keys($dates)),
            'views'  => array_column($dates, 'views'),
            'clicks' => array_column($dates, 'clicks'),
        ];

        // --- 3. Final Combined Data ---
        $data = [
            'totals' => [
                'views'  => (int) $total_views,
                'clicks' => (int) $total_clicks,
                'ctr'    => $ctr,
            ],
            'chart' => $chart_data,
        ];

        return new WP_REST_Response($data, 200);
    }
    public function track_view(WP_REST_Request $request)
    {
        $params = $request->get_json_params();
        return $this->insert_analytics_event('view', $params);
    }
    public function track_click(WP_REST_Request $request)
    {
        $params = $request->get_json_params();
        return $this->insert_analytics_event('click', $params);
    }
    private function insert_analytics_event($event_type, $params)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'surftrust_analytics';

        // Basic validation
        $notification_type = isset($params['notification_type']) ? sanitize_text_field($params['notification_type']) : '';
        $notification_id   = isset($params['notification_id']) ? absint($params['notification_id']) : 0;
        $product_id        = isset($params['product_id']) ? absint($params['product_id']) : 0;

        if (empty($notification_type)) {
            return new WP_REST_Response(['success' => false, 'message' => 'Missing notification type.'], 400);
        }

        $wpdb->insert(
            $table_name,
            [
                'event_type'        => $event_type,
                'notification_type' => $notification_type,
                'notification_id'   => $notification_id,
                'product_id'        => $product_id,
                'timestamp'         => current_time('mysql'),
            ]
        );

        return new WP_REST_Response(['success' => true], 200);
    }
}
