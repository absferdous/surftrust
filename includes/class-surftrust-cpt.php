<?php

/**
 * Registers the Custom Post Type for notifications.
 *
 * @package    Surftrust
 * @subpackage Surftrust/includes
 */
class Surftrust_CPT
{

    /**
     * The unique identifier for this post type.
     */
    const POST_TYPE = 'st_notification';

    /**
     * Initialize the class and register the post type.
     */
    public function __construct()
    {
        add_action('init', array($this, 'register_post_type'));
    }

    /**
     * Register the 'surftrust_notification' post type.
     */
    public function register_post_type()
    {
        $labels = array(
            'name'                  => _x('Notifications', 'Post Type General Name', 'surftrust'),
            'singular_name'         => _x('Notification', 'Post Type Singular Name', 'surftrust'),
            'menu_name'             => __('SurfPop', 'surftrust'),
            'name_admin_bar'        => __('Notification', 'surftrust'),
            'archives'              => __('Notification Archives', 'surftrust'),
            'attributes'            => __('Notification Attributes', 'surftrust'),
            'parent_item_colon'     => __('Parent Notification:', 'surftrust'),
            'all_items'             => __('All Notifications', 'surftrust'),
            'add_new_item'          => __('Add New Notification', 'surftrust'),
            'add_new'               => __('Add New', 'surftrust'),
            'new_item'              => __('New Notification', 'surftrust'),
            'edit_item'             => __('Edit Notification', 'surftrust'),
            'update_item'           => __('Update Notification', 'surftrust'),
            'view_item'             => __('View Notification', 'surftrust'),
            'view_items'            => __('View Notifications', 'surftrust'),
            'search_items'          => __('Search Notification', 'surftrust'),
        );

        $args = array(
            'label'                 => __('Notification', 'surftrust'),
            'description'           => __('Surftrust Notifications', 'surftrust'),
            'labels'                => $labels,
            'supports'              => array('title'), // We only need a title
            'hierarchical'          => false,
            'public'                => false, // Not visible on the public site
            'show_ui'               => true,  // Show in the admin dashboard
            'show_in_menu'          => false,  // Show as a top-level menu item
            'menu_position'         => 30,
            'menu_icon'             => 'dashicons-bell',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => false,
            'can_export'            => true,
            'has_archive'           => false,
            'exclude_from_search'   => true,
            'publicly_queryable'    => false,
            'capability_type'       => 'post',
            'show_in_rest'          => false, // We will use our own custom endpoints
        );

        register_post_type(self::POST_TYPE, $args);
    }
}
