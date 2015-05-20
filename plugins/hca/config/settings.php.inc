<?php

/**
 * @package WordPress 
 * @subpackage Harvard Charlie Archive 
 *
 * Sundry adjustments and settings for the theme
 */


// Remove select links from the WordPress admin top navigation bar
function hca_remove_admin_bar_links() {
    global $wp_admin_bar;
    //$wp_admin_bar->remove_menu('wp-logo');          // Remove the WordPress logo
    $wp_admin_bar->remove_menu('about');            // Remove the about WordPress link
    $wp_admin_bar->remove_menu('wporg');            // Remove the WordPress.org link
    $wp_admin_bar->remove_menu('documentation');    // Remove the WordPress documentation link
    $wp_admin_bar->remove_menu('support-forums');   // Remove the support forums link
    $wp_admin_bar->remove_menu('feedback');         // Remove the feedback link
    //$wp_admin_bar->remove_menu('site-name');        // Remove the site name menu
    //$wp_admin_bar->remove_menu('view-site');        // Remove the view site link
    $wp_admin_bar->remove_menu('updates');          // Remove the updates link
    $wp_admin_bar->remove_menu('comments');         // Remove the comments link
    $wp_admin_bar->remove_menu('edit');         // Remove the comments link
    //$wp_admin_bar->remove_menu('new-content');      // Remove the content link
    //$wp_admin_bar->remove_menu('w3tc');             // If you use w3 total cache remove the performance link
    //$wp_admin_bar->remove_menu('my-account');       // Remove the user details tab
}
add_action( 'wp_before_admin_bar_render', 'hca_remove_admin_bar_links' );

// Enforce user only accessing comments for researchers they're authorized on 
function hca_restrict_unauthorized_comment() {
    if ($_SERVER['PHP_SELF'] == '/wp-admin/post.php'){
        // Post edit page (any type of content)
        // Default is that the user can't edit
        $user_can_edit = False;

        $post_id = $_GET['post'] ? $_GET['post'] : $_POST['post_ID'];

        // Get the post and check the type
        $post = get_post( $post_id );
        $post_type = $post->post_type;


        if ( $post_type == "commentary" ){

            // Get the p2p connection for the researcher
            $connected = p2p_get_connections( 'commentary_to_researcher',
                                                    array(
                                                            'direction' => 'from', 
                                                            'from' => $post_id, 
                                                            'to' => 'any', 
                                                            'fields' => 'all'
                                                        )
                                                ); 
            if ( count( $connected ) > 0 ){

                // Get the user's valid researchers
                $user = wp_get_current_user()->ID;
                $valid_researchers = hca_check_user_auth( $user );

                foreach ($connected as $researcher){
                    if ( in_array( (int) $researcher->p2p_to, $valid_researchers ) ){
                        $user_can_edit = True;
                    }
                }


            }else{
                $user_can_edit = True;
            }


        }else if ( $post_type == "researcher" ){

            // If the current user can add users, it's an administrator
            if ( current_user_can('add_users') ){
                $user_can_edit = True;
            }else {
                // Add a special error message
                _e( '
                    <html>
                    <head>
                        <title>Request researcher authentication</title>
                        <link rel="stylesheet" href="/wp-content/themes/hca/min/css/styles.css" type="text/css" media="screen" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    </head>
                    <body>
                        <style>
                            body {
                                background:#eee;
                            }
                            .error-wrap {
                                width:90%;
                                max-width:700px;
                                margin:50px auto;
                                background:#fff;
                                padding:20px 30px;;
                            }
                            h3 {
                                text-align:center;
                                font-size:26px;
                                margin:40px auto;

                            }
                            p {
                                margin:20px auto;
                                display:block;
                                line-height:25px;
                                font-size:20px;
                            }
                            a {
                                text-decoration:underline;
                            }
                        </style>
                        <div class="error-wrap" >
                            <h3 >
                                Currently only administrators and managers can edit researchers 
                            </h3>
                            <p >
                                If you need something to be changed with this researcher, please contact a system administrator or developer by emailing <a href="mailto:' . HELP_EMAIL . '">' . HELP_EMAIL . '</a>.
                            </p>
                        </div>
                    </body>
                    </html>
                        ', 'hca' );
                exit; 
            }

        }else {
            $user_can_edit = True;
        }


        // Check if post_researcher is in the user_valid_researchers array
        if ( $user_can_edit == False && !current_user_can('add_users') ){
            //wp_redirect(admin_url() ); 
            _e( '
                <html>
                <head>
                    <title>Request researcher authentication</title>
                    <link rel="stylesheet" href="/wp-content/themes/hca/min/css/styles.css" type="text/css" media="screen" />
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                </head>
                <body>
                    <style>
                        body {
                            background:#eee;
                        }
                        .error-wrap {
                            width:90%;
                            max-width:700px;
                            margin:50px auto;
                            background:#fff;
                            padding:20px 30px;;
                        }
                        h3 {
                            text-align:center;
                            font-size:26px;
                            margin:40px auto;

                        }
                        p {
                            margin:20px auto;
                            display:block;
                            line-height:25px;
                            font-size:20px;
                        }
                        a {
                            text-decoration:underline;
                        }
                    </style>
                    <div class="error-wrap" >
                        <h3 >
                            You currently don\'t have access to this researcher\'s content 
                        </h3>
                        <p >It looks like your account needs to be added to the researcher(s) associated with this content before you can edit it.</p> 
                        <p >Please request access to this researcher by emailing <a href="mailto:' . HELP_EMAIL . '">' . HELP_EMAIL . '</a>.
                        </p>
                    </div>
                </body>
                </html>
                    ', 'hca' );
            exit; 
        }





    }else if ($_SERVER['PHP_SELF'] == '/wp-admin/edit.php'){
        // List page
        //$posts = $_GET['posts'] ? $_GET['posts'] : $_POST['posts'];
        //error_log(var_export($_GET, True));

    }
}
function hca_remove_unauthorized_menu_links() {
    if(!current_user_can('add_users')) {
        remove_menu_page('options-general.php');
        remove_menu_page('link-manager.php'); 
        remove_menu_page('tools.php');
        remove_menu_page('edit-comments.php');
        remove_menu_page( 'edit.php' );
        //remove_menu_page( 'edit.php?post_type=commentary' );
        remove_menu_page( 'edit.php?post_type=researcher' );

        remove_submenu_page ('themes.php', 'themes.php');
        remove_submenu_page( 'themes.php', 'themes.php?page=options-framework');
        remove_submenu_page( 'themes.php', 'themes.php?page=options_framework' );
        remove_submenu_page( 'themes.php', 'themes.php?' );
        remove_submenu_page( 'themes.php', 'themes.php?page=costum_background' ); 
    }
}
add_action( 'admin_menu', 'hca_remove_unauthorized_menu_links', 999 );
add_action('admin_init', 'hca_restrict_unauthorized_comment');
