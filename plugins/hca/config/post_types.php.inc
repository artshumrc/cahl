<?php
/**
 * @package WordPress 
 * @subpackage Harvard Charlie Archive 
 *
 * Register necessary custom post types 
 *
 */

add_action( 'init', 'create_post_type' );
function create_post_type() {
	register_post_type( 'submission_proposal',
		array(
			'labels' => array(
				'name' => __( 'Submission Proposals' ),
				'singular_name' => __( 'Submission Proposals' )
			),
		'supports' => array( 'title', 'editor', 'thumbnail' ),
		'public' => true,
		'has_archive' => true,
		'description' => '',
		'map_meta_cap' => true,
		'has_archive' => true,
		'capability_type' => "submission_proposal"
		)
	);
}
