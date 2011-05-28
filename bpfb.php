<?php
/*
Plugin Name: BuddyPress Activity Plus
Plugin URI: http://premium.wpmudev.org/project/media-embeds-for-buddypress-activity
Description: A Facebook-style media sharing improvement for the activity box.
Version: 1.0.1
Author: Ve Bailovity (Incsub), designed by Brett Sirianni (The Edge)
Author URI: http://premium.wpmudev.org
WDP ID: 232

Copyright 2009-2011 Incsub (http://incsub.com)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License (Version 2 - GPLv2) as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

///////////////////////////////////////////////////////////////////////////
/* -------------------- Update Notifications Notice -------------------- */
if ( !function_exists( 'wdp_un_check' ) ) {
	add_action( 'admin_notices', 'wdp_un_check', 5 );
	add_action( 'network_admin_notices', 'wdp_un_check', 5 );
	function wdp_un_check() {
		if ( !class_exists( 'WPMUDEV_Update_Notifications' ) && current_user_can( 'install_plugins' ) )
			echo '<div class="error fade"><p>' . __('Please install the latest version of <a href="http://premium.wpmudev.org/project/update-notifications/" title="Download Now &raquo;">our free Update Notifications plugin</a> which helps you stay up-to-date with the most stable, secure versions of WPMU DEV themes and plugins. <a href="http://premium.wpmudev.org/wpmu-dev/update-notifications-plugin-information/">More information &raquo;</a>', 'wpmudev') . '</a></p></div>';
	}
}
/* --------------------------------------------------------------------- */

define ('BPFB_PLUGIN_SELF_DIRNAME', basename(dirname(__FILE__)), true);


//Setup proper paths/URLs and load text domains
if (is_multisite() && defined('WPMU_PLUGIN_URL') && defined('WPMU_PLUGIN_DIR') && file_exists(WPMU_PLUGIN_DIR . '/' . basename(__FILE__))) {
	define ('BPFB_PLUGIN_LOCATION', 'mu-plugins', true);
	define ('BPFB_PLUGIN_BASE_DIR', WPMU_PLUGIN_DIR, true);
	define ('BPFB_PLUGIN_URL', WPMU_PLUGIN_URL, true);
	$textdomain_handler = 'load_muplugin_textdomain';
} else if (defined('WP_PLUGIN_URL') && defined('WP_PLUGIN_DIR') && file_exists(WP_PLUGIN_DIR . '/' . BPFB_PLUGIN_SELF_DIRNAME . '/' . basename(__FILE__))) {
	define ('BPFB_PLUGIN_LOCATION', 'subfolder-plugins', true);
	define ('BPFB_PLUGIN_BASE_DIR', WP_PLUGIN_DIR . '/' . BPFB_PLUGIN_SELF_DIRNAME, true);
	define ('BPFB_PLUGIN_URL', WP_PLUGIN_URL . '/' . BPFB_PLUGIN_SELF_DIRNAME, true);
	$textdomain_handler = 'load_plugin_textdomain';
} else if (defined('WP_PLUGIN_URL') && defined('WP_PLUGIN_DIR') && file_exists(WP_PLUGIN_DIR . '/' . basename(__FILE__))) {
	define ('BPFB_PLUGIN_LOCATION', 'plugins', true);
	define ('BPFB_PLUGIN_BASE_DIR', WP_PLUGIN_DIR, true);
	define ('BPFB_PLUGIN_URL', WP_PLUGIN_URL, true);
	$textdomain_handler = 'load_plugin_textdomain';
} else {
	// No textdomain is loaded because we can't determine the plugin location.
	// No point in trying to add textdomain to string and/or localizing it.
	wp_die(__('There was an issue determining where Google Maps plugin is installed. Please reinstall.'));
}
$textdomain_handler('bpfb', false, BPFB_PLUGIN_SELF_DIRNAME . '/languages/');


$wp_upload_dir = wp_upload_dir();
define('BPFB_TEMP_IMAGE_DIR', $wp_upload_dir['basedir'] . '/bpfb/tmp/', true);
define('BPFB_TEMP_IMAGE_URL', $wp_upload_dir['baseurl'] . '/bpfb/tmp/', true);
define('BPFB_BASE_IMAGE_DIR', $wp_upload_dir['basedir'] . '/bpfb/', true);
define('BPFB_BASE_IMAGE_URL', $wp_upload_dir['baseurl'] . '/bpfb/', true);


// Hook up the installation routine and check if we're really, really set to go
require_once BPFB_PLUGIN_BASE_DIR . '/lib/class_bpfb_installer.php';
register_activation_hook(__FILE__, array(BpfbInstaller, 'install'));
BpfbInstaller::check();


/**
 * Helper function for going around the fact that
 * BuddyPress is NOT multisite compatible.
 */
function bpfb_get_image_url ($blog_id) {
	if (!defined('BP_ENABLE_MULTIBLOG') || !BP_ENABLE_MULTIBLOG) return BPFB_BASE_IMAGE_URL;
	if (!$blog_id) return BPFB_BASE_IMAGE_URL;
	switch_to_blog($blog_id);
	$wp_upload_dir = wp_upload_dir();
	restore_current_blog();
	return $wp_upload_dir['baseurl'] . '/bpfb/';
}


/**
 * Includes the core requirements and serves the improved activity box.
 */
function bpfb_plugin_init () {
	require_once(BPFB_PLUGIN_BASE_DIR . '/lib/class_bpfb_binder.php');
	require_once(BPFB_PLUGIN_BASE_DIR . '/lib/class_bpfb_codec.php');
	BpfbBinder::serve();
}
// Only fire off if BP is actually loaded.
add_action('bp_loaded', 'bpfb_plugin_init');