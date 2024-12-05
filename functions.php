<?php
// Enqueue the parent theme's style
function astra_child_enqueue_styles()
{
    wp_enqueue_style('astra', get_template_directory_uri() . '/style.css');
}
add_action('wp_enqueue_scripts', 'astra_child_enqueue_styles');

function enqueue_singpass_script()
{
    wp_enqueue_script('singpass-button-script', get_stylesheet_directory_uri() . '/js/singpass-button.js', array('jquery'), null, true);

    // Pass the AJAX URL to the script
    wp_localize_script('singpass-button-script', 'singpass_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'theme_url' => get_stylesheet_directory_uri()
    ));
}
add_action('wp_enqueue_scripts', 'enqueue_singpass_script');