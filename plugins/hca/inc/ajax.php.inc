<?php
/**
 * @package WordPress 
 * @subpackage Harvard Charlie Archive 
 *
 * containing callbacks / functions for wp ajax handling
 *
 */

// hca get_post
add_action( "wp_ajax_hca_get_posts", "hca_get_posts_callback" );
add_action( "wp_ajax_nopriv_hca_get_posts", "hca_get_posts_callback" );
add_action( "wp_ajax_hca_merge_posts", "hca_merge_posts_callback" );

// Referenced in Hc.Media.get_post() for AJAX callback
function hca_get_posts_callback () {
	$use_custom_query = FALSE;
	$request_args = $_POST["request_args"];
	$post_query = $_POST["post_query"];
	$query_type = $_POST["query_type"];
	$allowed_parameters = array( "p", "post_id", "author", "cat", "category__in", "category_name", "tag", "tag__in", "tag_id", "tax_query", "name", "post_type", "post_status", "meta_key", "meta_value", "meta_query", "showposts", "posts_per_page", "paged", "order", "orderby", "s", "connected_type", "connected_to" );
	$posts_data = array();
	$post_data = array();
	$query_args = array();
	$post = array();
	$response = array();

	// assign the specified parameters to the query args if they are in the $allowed_parameters
	foreach ( $post_query as $k => $v ) {

		if ( in_array( $k, $allowed_parameters ) ) {
			$query_args[ $k ] = $v; 
		}

		// if we have a meta_query or a connected_to in our query, we must use the custom query
		if ( $k == "meta_query" || $k == "connected_to" ) {
			$use_custom_query = TRUE;
		}	
	}

	// enforce no posts from trash
	$query_args['post_status'] = array('publish', 'pending', 'draft');

	// enforce not more than 200 posts returned in query 
	if ( isset( $query_args['showposts'] ) && $query_args['showposts'] > 200 ) {
		error_log( 'hca_show - hca_get_posts_callback:  requested too many posts with value "showposts", ' . $query_args['showposts'] );		
		die();
	}

	global $paged;
	global $wpdb;

	// get the Timber context 
	$context = Timber::get_context();


	// if we need to do a custom query for meta_query or p2p
	if ( $use_custom_query ) {

		// sanitize input variables for query
		$query_args = hca_sanitize_values($query_args);
		$paged = $query_args['paged'];

		$query = "SELECT DISTINCT wposts.* FROM $wpdb->posts wposts 
					LEFT JOIN $wpdb->postmeta totalorder 
						ON (wposts.ID = totalorder.post_id AND totalorder.meta_key = 'total_order')

						";

		// process meta_queries
		if ( array_key_exists( 'meta_query', $query_args ) && count($query_args['meta_query']) >= 1) {
			$added_lines_to_from_query = FALSE;
			foreach( $query_args['meta_query'] as $index => $meta_query ){
				$name = "wpostmeta" . $index;
				$query .= " JOIN $wpdb->postmeta " . $name . "
									ON (wposts.ID = " . $name . ".post_id";

				if( ($meta_query['key'] == "line_from" || $meta_query['key'] == "line_to") && $added_lines_to_from_query == FALSE ){
					$query .= " AND " . $name . ".meta_key = '" . $meta_query['key'] . "'";


					foreach( $query_args['meta_query'] as $meta_query){
						if($meta_query['key'] == "line_from" || $meta_query['key'] == "line_to"){
							if( is_array( $meta_query['value'] ) ){
								$meta_value = " (" . implode(',', $meta_query['value']) . ") ";
							}else {
								$meta_value = $meta_query['value'];
							}
							$query .= " AND " . $name . ".meta_value " . $meta_query['compare'] . " " . $meta_value;
						}
					}

					$query .= ")";
					$added_lines_to_from_query = TRUE;
					
				}else{
					if( is_array( $meta_query['value'] ) ){
						$meta_value = " (" . implode(',', $meta_query['value']) . ") ";
					}else {
						$meta_value = $meta_query['value'];
					}
					$query .= " AND " . $name . ".meta_key = '" . $meta_query['key'] . "'
								AND " . $name . ".meta_value " . $meta_query['compare'] . " " . $meta_value . ")";
				}
			}

		}

		// process p2p queries
		if ( array_key_exists( 'connected_to', $query_args ) ) {
			$query .= " JOIN $wpdb->p2p wp2p
								ON (wposts.ID = wp2p.p2p_from 
									AND wp2p.p2p_type = '" . $query_args['connected_type'] . "' 
									AND wp2p.p2p_to IN (" . implode(',', $query_args['connected_to']) . ") )";
		}

		// Enforce user authentication 
		// $query .= "INNER JOIN $wpdb->p2p wp2p_auth
		//					ON (wposts.ID = wp2p_auth.p2p_from 
		//						AND wp2p_auth.p2p_type = 'commentary_to_researcher'
		//						AND wp2p_auth.p2p_to IN (" . implode(',', $valid_researchers) . ") )";

		// add string search if necessary
		$query .= "WHERE";

		if (isset($query_args["s"])){
			$query .= "(wposts.post_title LIKE '%" . $query_args['s'] . "%' OR wposts.post_content LIKE '%" . $query_args['s'] . "%') AND";
		}

		// finalize query
		$query .= " wposts.post_type = 'commentary'
						AND wposts.post_status IN ('publish', 'pending', 'draft') 
					ORDER BY totalorder.meta_value ASC
					LIMIT " . $query_args['posts_per_page'] . " 
					OFFSET " . $query_args['posts_per_page'] * $query_args['paged']; 

		$context['posts'] = $wpdb->get_results( $query, OBJECT );

		// Unfortunately, right now, this still must happen for the paging to work correctly via Timber
		$query_args["paged"] = $query_args["paged"] + 1;
		query_posts( $query_args );

	} else {
		$query_args["paged"] = $query_args["paged"] + 1;
		$context['posts'] = query_posts( $query_args );
	}
	$context['pagination'] = Timber::get_pagination();

	// Then, return post values specified in request arguments
	// -- If request args are set, retrieve values for them
	if ( isset( $request_args ) ) {

		foreach ( $context['posts'] as $post ) {

			$post_data = array();

			foreach ( $request_args as $rk => $rv ) {

				// If the request_args key is in the post object, add it
				// Otherwise, get the post meta for the key
				if ( isset( $post->$rv ) ) {
					if ($rv == "post_content"){
						$post->$rv = do_shortcode($post->$rv);
					}else if ($rv == "post_excerpt") {
						$post->$rv = strip_tags($post->$rv);
					}
					$post_data[$rv] = $post->$rv;	
				} elseif ( $rv == "thumbnail" ) {

					$thumb = get_the_post_thumbnail( $post->ID, 'article' );
					$post_data['thumbnail_meta'] = ''; 
					if ( strlen( $thumb ) > 0 ) {
						$thumb_id = get_post_thumbnail_id( $post->ID ); $thumb_meta = get_posts(array('p' => $thumb_id, 'post_type' => 'attachment')); $post_data[$rv] = $thumb;
						$post_data['thumbnail_meta'] = ''; 
						if (count($thumb_meta) > 0 ){
							$post_data['thumbnail_meta'] = $thumb_meta[0];
						}
					}

				} elseif ( $rv == "max_num_pages" ) {
					$post_data[$rv] = $res->max_num_pages;
				} elseif ( $rv == "researcher" ) {

					$connected = p2p_get_connections( 'commentary_to_researcher',
															array(
																	'direction' => 'from', 
																	'from' => $post->ID, 
																	'to' => 'any', 
																	'fields' => 'all'
																)
														); 

					$obj = get_post($connected[0]->p2p_to);
					$post_data[$rv] = $obj;
				} elseif ( $rv == "text" ) {
					$connected = p2p_get_connections( 'text_to_commentary',
															array(
																	'direction' => 'to', 
																	'from' => $post->ID, 
																	'to' => 'any',  
																	'fields' => 'all'
																)
														); 
					$obj = array( 
									"text" => get_post( $connected[0]->p2p_from ),
									"meta" => p2p_get_meta( $connected[0]->p2p_id ),
								);
					$post_data[$rv] = $obj;
				} else {
					$meta = get_post_meta( $post->ID, $rv );
					$post_data[$rv] = $meta[0]; 
				}

			}

			$posts_data[] = $post_data;
		}

	// If request args are not set, return the whole post array 
	} else {
		$posts_data = $context['posts'];
	}

	// posts from the query 
	$response['posts'] = $posts_data;

	// buffer output of timber render to get the pagination
	ob_start();
	$response['pagination'] = preg_replace('~[\r\n\t]+~', '', Timber::render( 'mods/pagination.twig', $context, FALSE ) );
	ob_end_clean();

	// Finally, json encode the post_data array and die 
	echo json_encode( $response );

    die();	
}


// Use Wordpress native sanitize functions to check query params
function hca_sanitize_values($query_args){

	$valid_compares = array("=", "IN", "<", ">", "<=", ">=", "LIKE");

	// meta query variables
	if (isset($query_args['meta_query'])){
		foreach( $query_args['meta_query'] as $meta_query){
			$meta_query['key'] = hca_strip_nonalphanum(sanitize_text_field($meta_query['value'])); 
			$meta_query['value'] = hca_strip_nonalphanum(sanitize_text_field($meta_query['value'])); 
			if (in_array($meta_query['compare'], $valid_compares)){
				$meta_query['compare'] = $meta_query['compare']; 
			}else {
				$meta_query['compare'] = "="; 
			}
		}
	}

	// p2p variables
	if (isset($query_args['connected_type'])){
		$meta_query['connected_type'] = hca_strip_nonalphanum(sanitize_text_field($meta_query['connected_type'])); 
	}
	if (isset($query_args['connected_to'])){
		$sanitized_connected_to = array();
		if( is_array( $query_args['connected_to'] ) ){
			foreach( $query_args['connected_to'] as $connected_to){
				$sanitized_connected_to[] = hca_strip_nonalphanum(sanitize_text_field($connected_to));
			}
			$query_args['connected_to'] = $sanitized_connected_to; 
		}else {
			$query_args['connected_to'] = hca_strip_nonalphanum(sanitize_text_field($query_args['connected_to'])); 
		}
	}

	// primary query params
	$query_args['s'] = hca_strip_nonalphanum(sanitize_text_field($query_args['s']));
	$query_args['posts_per_page'] = hca_strip_nonalphanum(sanitize_text_field($query_args['posts_per_page']));
	$query_args['paged'] = hca_strip_nonalphanum(sanitize_text_field($query_args['paged']));

	return $query_args;
}

// Strip the non-alpha-numeric characters from a string
function hca_strip_nonalphanum($string){
	return preg_replace("/[^A-Za-z0-9 ]/", '', $string);
}

// Check the user authentication against the Researchers
function hca_check_user_auth($user){
	$researchers = new WP_Query( 
				array( 
					'post_type' => 'researcher', 
					'posts_per_page' => -1 
					) 
			);
	$auth_res = array();
	foreach( $researchers->posts as $i => $researcher ) {

		$authenticated_editors = get_post_meta( $researcher->ID, "authenticated_editors" );

		foreach( $authenticated_editors as $auth_arr ) {
			if ( is_array( $auth_arr ) == False ) {
				$auth_arr = array($auth_arr);
			}
			if ( in_array( $user, $auth_arr) ){
				$auth_res[] = $researcher->ID;	
			}
		} 
	}

	return $auth_res; 
}

