<?php

if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
		} );
	return;
}

class HarvardSite extends TimberSite {

	function __construct() {
		add_theme_support( 'post-formats' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		parent::__construct();
	}

	function register_post_types() {
		//this is where you can register custom post types
	}

	function register_taxonomies() {
		//this is where you can register custom taxonomies
	}

	function add_to_context( $context ) {
		$context['menu'] = new TimberMenu();
		$context['site'] = $this;
		return $context;
	}

	function add_to_twig( $twig ) {
		/* this is where you can add your own fuctions to twig */
		$twig->addExtension( new Twig_Extension_StringLoader() );
		//$twig->addFilter( 'myfoo', new Twig_Filter_Function( 'myfoo' ) );
		return $twig;
	}


}

add_action( 'wpcf7_before_send_mail', 'save_submission_form' );
function save_submission_form( $cf7 ) {
	$submission = WPCF7_Submission::get_instance();
  
	if ( $submission ) {
		$posted_data = $submission->get_posted_data();
	}
	$post_title = "Submission From " . $posted_data["text-159"] . " " . $posted_data["text-160"] . ": " . $posted_data['email-632'];
	 
	$radio_1 = $posted_data['radio-424'];
	if ( count( $radio_1 ) ){
		$radio_1 = $radio_1[0];
	}
	$radio_2 = $posted_data['radio-425'];
	if ( count( $radio_2 ) ){
		$radio_2 = $radio_2[0];
	}
	$radio_3 = $posted_data['radio-426'];
	if ( count( $radio_3 ) ){
		$radio_3 = $radio_3[0];
	}

	 

	$post_content = "
			First name: " . $posted_data['text-159'] . "
			Last name: " . $posted_data['text-160'] . "
			Address: " . $posted_data['textarea-532'] . "
			Email: " . $posted_data['email-632'] . "

			Will submit via email/internet?: " . $radio_1 . "
			Will submit via postal services?: " . $radio_2 . "

			Terms used to describe: " . 
			$posted_data['textarea-533']  . "
			
			Description in own words: " . 
			$posted_data['textarea-534']  . "


			Location: " . $posted_data['text-161'] . "
			Date: " . $posted_data['text-162'] . "
			Author: " . $posted_data['text-163'] . "
			Photo ID: " . $posted_data['file-151'] . "
			Include name?: " . $radio_3 . "
		";

	$post = array(
			'post_content' => $post_content,
			'post_title' => $post_title,
			'post_author' => 1,
			'post_status' => "private"
		);

	wp_insert_post( $post );
}

new HarvardSite();
