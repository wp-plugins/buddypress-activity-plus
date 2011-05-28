(function($){
$(function() {

var $form;
var $text;
var $textContainer;

var _bpfbActiveHandler = false;


/**
 * Video insertion/preview handler.
 */
var BpfbVideoHandler = function () {
	$container = $(".bpfb_controls_container");
	
	var createMarkup = function () {
		var html = '<input type="text" id="bpfb_video_url" name="bpfb_video_url" value="' + l10nBpfb.paste_video_url + '" />' +
			'<input type="button" id="bpfb_video_url_preview" value="' + l10nBpfb.preview + '" />';
		$container.empty().append(html);
		
		$('#bpfb_video_url').width($container.width());
		$('#bpfb_video_url').focus(function () { 
			$(this)
				.select()
				.addClass('changed')
			;
		});
		
		$('#bpfb_video_url').change(createVideoPreview);
		$('#bpfb_video_url_preview').click(createVideoPreview);
	};
	
	var createVideoPreview = function () {
		var url = $('#bpfb_video_url').val();
		if (!url) return false;
		$.post(ajaxurl, {"action":"bpfb_preview_video", "data":url}, function (data) {
			$('.bpfb_preview_container').empty().html(data);
			$('.bpfb_action_container').html(
				'<p><input type="button" class="button-primary bpfb_primary_button" id="bpfb_submit" value="' + l10nBpfb.add_video + '" /> ' +
				'<input type="button" class="button" id="bpfb_cancel" value="' + l10nBpfb.cancel + '" /></p>'
			);
		});
	};
	
	var processForSave = function () {
		return {
			"bpfb_video_url": $("#bpfb_video_url").val()
		};
	};
	
	var init = function () {
		$('#aw-whats-new-submit').hide();
		createMarkup();
	};
	
	var destroy = function () {
		$container.empty();
		$('.bpfb_preview_container').empty();
		$('.bpfb_action_container').empty();
		$('#aw-whats-new-submit').show();
	};
	
	init ();
	
	return {"destroy": destroy, "get": processForSave};
};


/**
 * Link insertion/preview handler.
 */
var BpfbLinkHandler = function () {
	$container = $(".bpfb_controls_container");
	
	var createMarkup = function () {
		var html = '<input type="text" id="bpfb_link_preview_url" name="bpfb_link_preview_url" value="' + l10nBpfb.paste_link_url + '" />' +
			'<input type="button" id="bpfb_link_url_preview" value="' + l10nBpfb.preview + '" />';
		$container.empty().append(html);
		
		$('#bpfb_link_preview_url').width($container.width());
		$('#bpfb_link_preview_url').focus(function () { 
			$(this)
				.select()
				.addClass('changed')
			;
		});
		
		$('#bpfb_link_preview_url').change(createLinkPreview);
		$('#bpfb_link_url_preview').click(createLinkPreview);
	};
	
	var createPreviewMarkup = function (data) {
		if (!data.url) {
			$('.bpfb_preview_container').empty().html(data.title);
			return false;
		}
		var imgs = '';
		$.each(data.images, function(idx, img) {
			var url = img.match(/^http/) ? img : data.url + '/' + img;
			imgs += '<img class="bpfb_link_preview_image" src="' + url + '" />';
		});
		var html = '<table border="0">' +
			'<tr>' +
				'<td>' +
					'<div class="bpfb_link_preview_container">' +
						imgs +
						'<input type="hidden" name="bpfb_link_img" value="" />' +
					'</div>' +
				'</td>' +
				'<td>' +
					'<div class="bpfb_link_preview_title">' + data.title + '</div>' +
					'<input type="hidden" name="bpfb_link_title" value="' + data.title + '" />' +
					'<div class="bpfb_link_preview_url">' + data.url + '</div>' +
					'<input type="hidden" name="bpfb_link_url" value="' + data.url + '" />' +
					'<div class="bpfb_link_preview_body">' + data.text + '</div>' +
					'<input type="hidden" name="bpfb_link_body" value="' + data.text + '" />' +
					'<div class="bpfb_thumbnail_chooser">' +
						'<img class="bpfb_thumbnail_chooser_left" src="' + _bpfbRootUrl + '/img/system/left.gif" />' +
						'&nbsp;' +
						'<img class="bpfb_thumbnail_chooser_right" src="' + _bpfbRootUrl + '/img/system/right.gif" />' +
						'&nbsp;' +
						l10nBpfb.choose_thumbnail +
					'</div>' +
				'</td>' +
			'</tr>' +
		'</table>';
		$('.bpfb_preview_container').empty().html(html);
		$('.bpfb_action_container').html(
			'<p><input type="button" class="button-primary bpfb_primary_button" id="bpfb_submit" value="' + l10nBpfb.add_link + '" /> ' +
			'<input type="button" class="button" id="bpfb_cancel" value="' + l10nBpfb.cancel + '" /></p>'
		);
		
		$('img.bpfb_link_preview_image').hide();
		$('img.bpfb_link_preview_image').first().show();
		$('input[name="bpfb_link_img"]').val($('img.bpfb_link_preview_image').first().attr('src'));
		
		$('.bpfb_thumbnail_chooser_left').click(function () {
			var $cur = $('img.bpfb_link_preview_image:visible');
			var $prev = $cur.prev('.bpfb_link_preview_image');
			if ($prev.length) {
				$cur.hide();
				$prev
					.width($('.bpfb_link_preview_container').width())
					.show();
				$('input[name="bpfb_link_img"]').val($prev.attr('src'));
			}
			return false;
		});
		$('.bpfb_thumbnail_chooser_right').click(function () {
			var $cur = $('img.bpfb_link_preview_image:visible');
			var $next = $cur.next('.bpfb_link_preview_image');
			if ($next.length) {
				$cur.hide();
				$next
					.width($('.bpfb_link_preview_container').width())
					.show();
				$('input[name="bpfb_link_img"]').val($next.attr('src'));
			}
			return false;
		});
	};
	
	var createLinkPreview = function () {
		var url = $('#bpfb_link_preview_url').val();
		if (!url) return false;
		$.post(ajaxurl, {"action":"bpfb_preview_link", "data":url}, function (data) {
			createPreviewMarkup(data);
		});
	};
	
	var processForSave = function () {
		return {
			"bpfb_link_url": $('input[name="bpfb_link_url"]').val(),
			"bpfb_link_image": $('input[name="bpfb_link_img"]').val(),
			"bpfb_link_title": $('input[name="bpfb_link_title"]').val(),
			"bpfb_link_body": $('input[name="bpfb_link_body"]').val()
		};
	};
	
	var init = function () {
		$('#aw-whats-new-submit').hide();
		createMarkup();
	};
	
	var destroy = function () {
		$container.empty();
		$('.bpfb_preview_container').empty();
		$('.bpfb_action_container').empty();
		$('#aw-whats-new-submit').show();
	};
	
	init ();
	
	return {"destroy": destroy, "get": processForSave};
};


/**
 * Photos insertion/preview handler.
 */
var BpfbPhotoHandler = function () {
	$container = $(".bpfb_controls_container");
	
	var createMarkup = function () {
		var html = '<div id="bpfb_tmp_photo"> </div>' +
			'<ul id="bpfb_tmp_photo_list" style="display:none"></ul>';
		$container.append(html);
		
		var uploader = new qq.FileUploader({
			"element": $('#bpfb_tmp_photo')[0],
			"listElement": $('#bpfb_tmp_photo_list')[0],
			"allowedExtensions": ['jpg', 'jpeg', 'png', 'gif'],
			"action": ajaxurl,
			"params": {
				"action": "bpfb_preview_photo"
			},
			"onComplete": createPhotoPreview
		});
	};
	
	var createPhotoPreview = function (id, fileName, resp) {
		if ("error" in resp) return false;
		var html = '<img class="bpfb_preview_photo_item" src="' + _bpfbTempImageUrl + resp.file + '" width="80px" />' +
			'<input type="hidden" class="bpfb_photos_to_add" name="bpfb_photos[]" value="' + resp.file + '" />';
		$('.bpfb_preview_container').append(html);
		$('.bpfb_action_container').html(
			'<p><input type="button" class="button-primary bpfb_primary_button" id="bpfb_submit" value="' + l10nBpfb.add_photos + '" /> ' +
			'<input type="button" class="button" id="bpfb_cancel" value="' + l10nBpfb.cancel + '" /></p>'
		);
	};
	
	var removeTempImages = function (rti_callback) {
		var $imgs = $('input.bpfb_photos_to_add');
		if (!$imgs.length) return rti_callback();
		$.post(ajaxurl, {"action":"bpfb_remove_temp_images", "data": $imgs.serialize().replace(/%5B%5D/g, '[]')}, function (data) {
			rti_callback();
		});
	};
	
	var processForSave = function () {
		var $imgs = $('input.bpfb_photos_to_add');
		var imgArr = [];
		$imgs.each(function () {
			imgArr[imgArr.length] = $(this).val();
		});
		return {
			"bpfb_photos": imgArr//$imgs.serialize().replace(/%5B%5D/g, '[]')
		};
	};
	
	var init = function () {
		$container.empty();
		$('.bpfb_preview_container').empty();
		$('.bpfb_action_container').empty();
		$('#aw-whats-new-submit').hide();
		createMarkup();
	};
	
	var destroy = function () {
		removeTempImages(function() {
			$container.empty(); 
			$('.bpfb_preview_container').empty(); 	
			$('.bpfb_action_container').empty();
			$('#aw-whats-new-submit').show();
		});
	};
	
	removeTempImages(init);
	
	return {"destroy": destroy, "get": processForSave};
};


/* === End handlers  === */


/**
 * Main interface markup creation.
 */
function createMarkup () {
	var html = '<div class="bpfb_actions_container">' +
		'<div class="bpfb_toolbar_container">' +
			'<a href="#cancel" id="bpfb_cancel_action"><img src="' + _bpfbRootUrl + '/img/system/plus.png" border="0" /></a>' +
			'&nbsp;' +
			'<a href="#photos" title="' + l10nBpfb.add_photos + '" id="bpfb_addPhotos"><img src="' + _bpfbRootUrl + '/img/system/camera.png" border="0" /></a>' +
			'&nbsp;' +
			'<a href="#videos" title="' + l10nBpfb.add_videos + '" id="bpfb_addVideos"><img src="' + _bpfbRootUrl + '/img/system/film.png" border="0" /></a>' +
			'&nbsp;' +
			'<a href="#links" title="' + l10nBpfb.add_links + '" id="bpfb_addLinks"><img src="' + _bpfbRootUrl + '/img/system/link.png" border="0" /></a>' +
		'</div>' +
		'<div class="bpfb_controls_container">' +
		'</div>' +
		'<div class="bpfb_preview_container">' +
		'</div>' +
		'<div class="bpfb_action_container">' +
		'</div>' +
	'</div>';
	$form.wrap('<div class="bpfb_form_container" />');
	$textContainer.after(html);
}


/**
 * Initializes the main interface.
 */
function init () {
	$form = $("#whats-new-form");
	$text = $form.find('textarea[name="whats-new"]');
	$textContainer = $form.find('#whats-new-textarea');
	createMarkup();
	$('#bpfb_addPhotos').click(function () {
		if (_bpfbActiveHandler) _bpfbActiveHandler.destroy();
		_bpfbActiveHandler = new BpfbPhotoHandler();
		$('#bpfb_cancel_action img').attr('src', _bpfbRootUrl + '/img/system/cancel.png');
		return false;
	});
	$('#bpfb_addLinks').click(function () {
		if (_bpfbActiveHandler) _bpfbActiveHandler.destroy();
		_bpfbActiveHandler = new BpfbLinkHandler();
		$('#bpfb_cancel_action img').attr('src', _bpfbRootUrl + '/img/system/cancel.png');
		return false;
	});
	$('#bpfb_addVideos').click(function () {
		if (_bpfbActiveHandler) _bpfbActiveHandler.destroy();
		_bpfbActiveHandler = new BpfbVideoHandler();
		$('#bpfb_cancel_action img').attr('src', _bpfbRootUrl + '/img/system/cancel.png');
		return false;
	});
	$('#bpfb_cancel_action').click(function () {
		_bpfbActiveHandler.destroy();
		$('#bpfb_cancel_action img').attr('src', _bpfbRootUrl + '/img/system/plus.png');
		return false;
	});
	$('#bpfb_submit').live('click', function () {
		var params = _bpfbActiveHandler.get();
		var group_id = $('#whats-new-post-in').length ? $('#whats-new-post-in').val() : 0;
		$.post(ajaxurl, {
			"action": "bpfb_update_activity_contents", 
			"data": params, 
			"content": $text.val(), 
			"group_id": group_id
		}, function (data) {
			_bpfbActiveHandler.destroy();
			$text.val('');
			$('#activity-stream').prepend(data.activity);
			/**
			 * Handle image scaling in previews.
			 */
			$(".bpfb_final_link img").each(function () {
				$(this).width($(this).parents('div').width());
			});
		});
	});
	$('#bpfb_cancel').live('click', function () {
		_bpfbActiveHandler.destroy();
	});
}


// Only initialize if we're supposed to.
if ($("#whats-new-form").is(":visible")) init();


/**
 * Handle image scaling in previews.
 */
$(".bpfb_final_link img").each(function () {
	$(this).width($(this).parents('div').width());
});

});
})(jQuery);