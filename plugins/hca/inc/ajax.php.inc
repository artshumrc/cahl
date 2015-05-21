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

	// Query the posts
	$query_args["paged"] = $query_args["paged"] + 1;
	$context['posts'] = query_posts( $query_args );
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
	$response['pagination'] = preg_replace('~[\r\n\t]+~', '', Timber::render( 'partials/pagination.twig', $context, FALSE ) );
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

