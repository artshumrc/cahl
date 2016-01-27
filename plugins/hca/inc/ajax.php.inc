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

add_action( "wp_ajax_hca_send_mail", "hca_send_mail_callback" );
add_action( "wp_ajax_nopriv_hca_send_mail", "hca_send_mail_callback" );

// Referenced in Hc.Media.get_post() for AJAX callback
function hca_get_posts_callback () {
	$request_args = explode( ',', $_GET["request_args"] );
	$post_query = json_decode(stripslashes($_GET["post_query"]), $assoc = TRUE);

	$allowed_parameters = array( "p", "post_id", "author", "cat", "category__in", "category_name", "tag", "tag__in", "tag_id", "tax_query", "name", "post_type", "post_status", "meta_key", "meta_value", "meta_query", "showposts", "posts_per_page", "paged", "order", "orderby", "s", "connected_type", "connected_to" );
	$posts_data = array();
	$post_data = array();
	$query_args = array();
	$post = array();
	$response = array();

	error_log("query_args" . var_export($_REQUEST, true));

	// assign the specified parameters to the query args if they are in the $allowed_parameters
	foreach ( $post_query as $k => $v ) {

		if ( in_array( $k, $allowed_parameters ) ) {
			$query_args[ $k ] = $v;
		}

	}

	// enforce no posts from trash
	$query_args['post_status'] = array('publish');

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


function hca_send_mail_callback(){

	$to = "lukehollis@gmail.com";
	$submission_message = "";
	$user_response_email = "";
	$headers = 'From: The Charlie Archive at the Harvard Library (No Reply) <noreply@charlie.harvard.edu>' . "\r\n";
	$submission = json_decode( stripslashes( $_REQUEST['submission'] ), $assoc=true );
	$language = $_REQUEST['language'];

	error_log("Submission: " . var_export( $submission, true ) );
	error_log("Language: " . var_export( $language, true ) );
	error_log("Email: " . var_export( $submission['email'], true ) );




	$submission_message = "";


	error_log("Message: " . var_export( $submission_message, true ) );


	$was_sent_submission = wp_mail( "lukehollis@gmail.com", "New Submission Proposal to the Charlie Archive", $submission_message, $headers );
	error_log("wp_mail response (submission): " . var_export($was_sent_submission,true));


	if( $language == "english" ){
		$user_response_email = "Thank you for considering donating material to the Harvard Charlie Archive. We appreciate your interest in contributing to our collection. We will be in contact within two weeks.";

	} else if ( $language == "french" ){
		$user_response_email = "Merci pour votre intérêt. Nous attendons avec impatience vos commentaires sur notre projet, ou mieux encore, vos contributions aux archives.";

	}

	$was_sent_thankyou = wp_mail( $submission['email'], "Thank You for Your Submission Propsal", $user_response_email, $headers );
	error_log("wp_mail response (thank you): " . var_export($was_sent_thankyou,true));

	return True;
}
