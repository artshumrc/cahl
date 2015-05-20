<?php

/**
 * @package WordPress 
 * @subpackage Harvard Charlie Archive 
 *
 * Plugin Name: Harvard Charlie Archive 
 * Description: Plugin associated with the Harvard Charlie Archive
 * Version: 0.0.1
 * Author: Luke Hollis, Archimedes Digital 
 * Author URI: http://archimedesdigital.io
 */

define('HCA_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

// Define project timezone
define('TIMEZONE', 'America/New_York');

// require settings 
require_once( HCA_PLUGIN_DIR .'config/settings.php.inc');
require_once( HCA_PLUGIN_DIR .'config/post_types.php.inc');

// require other specific plugin functionalities 
require_once( HCA_PLUGIN_DIR .'inc/ajax.php.inc');
