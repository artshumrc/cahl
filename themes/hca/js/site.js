(function($){
$(document).ready(function($) {
	"use_strict";

	window.__Hc__ = window.__Hc__ || {};
	var Hc = window.__Hc__
	;


	Hc.curr_depth = $(window).scrollTop();
	Hc.prev_depth = 0;
	Hc.header_block_height = $(".block.head").height() + 280;
	Hc.header_shown = false;

	// Scroll event
	$(document).on("scroll", function(e) {

		Hc.prev_depth = Hc.curr_depth;
		Hc.curr_depth = $(window).scrollTop();

		// Down scroll event
		if(Hc.prev_depth < Hc.curr_depth){


		// Up scroll event
		}else {


		}

		// Show the fixed header at the end of the header block
		if(Hc.curr_depth > Hc.header_block_height){
			if(!Hc.header_shown){
				$("header").fadeIn("fast")
				Hc.header_shown = true;

			}

		}else{
			if(Hc.header_shown){
				$("header").fadeOut("fast")
				Hc.header_shown = false;

			}

		}

	});

	$("nav a").bind("click",function(e){
		$('html, body').animate({

			scrollTop: $( "#" + e.target.dataset.link_id ).offset().top
		}, 300);

	});

	$(".has-children").bind("mouseover",function(e){
		var $target = $(e.target);
		if (!$target.hasClass("has-children")){
			$target = $target.parents(".has-children");
		}

		$target.children(".dropdown-panel").removeClass("raised").addClass("lowered");
	});
	$(".has-children").bind("mouseout",function(e){
		var $target = $(e.target);
		if (!$target.hasClass("has-children")){
			$target = $target.parents(".has-children");
		}
		$target.children(".dropdown-panel").removeClass("lowered").addClass("raised");
	});


	// Smooth scroll to inner links

  $('.inner-link').each(function(){
      var href = $(this).attr('href');
      if(href.charAt(0) !== "#"){
          $(this).removeClass('inner-link');
      }
  });

  if($('.inner-link').length){
      $('.inner-link').smoothScroll({
          offset: -55,
          speed: 800
      });
  }

	// Smooth scroll to inner links

	$('.inner-link').each(function(){
			var href = $(this).attr('href');
			if(href.charAt(0) !== "#"){
					$(this).removeClass('inner-link');
			}
	});

	if($('.inner-link').length){
	$('.inner-link').smoothScroll({
		offset: -55,
		speed: 800
	});
	}

	// Update scroll variable for scrolling functions

	addEventListener('scroll', function() {
			mr_scrollTop = window.pageYOffset;
	}, false);

	// Append .background-image-holder <img>'s as CSS backgrounds

	$('.background-image-holder').each(function() {
			var imgSrc = $(this).children('img').attr('src');
			$(this).css('background', 'url("' + imgSrc + '")');
			$(this).children('img').hide();
			$(this).css('background-position', 'initial');
	});

	// Fade in background images

	setTimeout(function() {
			$('.background-image-holder').each(function() {
					$(this).addClass('fadeIn');
			});
	}, 1000);

  // Disable parallax on mobile

  if ((/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
      $('section').removeClass('parallax');
  }

  // Mobile Menu
  $('.mobile-toggle').click(function() {
    $('.nav-bar').toggleClass('nav-open');
    $(this).toggleClass('active');
  });

	// Multipurpose Modals

if($('.foundry_modal').length){
	var modalScreen = $('<div class="modal-screen">').appendTo('body');
}

$('.modal-container').each(function(index) {
		if($(this).find('iframe[src]').length){
			$(this).find('.foundry_modal').addClass('iframe-modal');
			var iframe = $(this).find('iframe');
			var src = iframe.attr('src');
			iframe.attr('src', '');
			iframe.data('data-src');
			iframe.attr('data-src', src);
		}
		$(this).find('.btn-modal').attr('modal-link', index);
		$(this).find('.foundry_modal').clone().appendTo('body').attr('modal-link', index).prepend($('<i class="ti-close close-modal">'));
});

$('.btn-modal').click(function(){
	var linkedModal = $('section').closest('body').find('.foundry_modal[modal-link="' + $(this).attr('modal-link') + '"]');
		$('.modal-screen').toggleClass('reveal-modal');
		if(linkedModal.find('iframe').length){
			linkedModal.find('iframe').attr('src', linkedModal.find('iframe').attr('data-src'));
		}
		linkedModal.toggleClass('reveal-modal');
		return false;
});

// Autoshow modals

$('.foundry_modal[data-time-delay]').each(function(){
var modal = $(this);
var delay = modal.attr('data-time-delay');
modal.prepend($('<i class="ti-close close-modal">'));
	if(typeof modal.attr('data-cookie') != "undefined"){
			if(!mr_cookies.hasItem(modal.attr('data-cookie'))){
						setTimeout(function(){
					modal.addClass('reveal-modal');
					$('.modal-screen').addClass('reveal-modal');
				},delay);
				}
		}else{
				setTimeout(function(){
						modal.addClass('reveal-modal');
						$('.modal-screen').addClass('reveal-modal');
				},delay);
		}
});

$('.close-modal:not(.modal-strip .close-modal)').click(function(){
	var modal = $(this).closest('.foundry_modal');
		modal.toggleClass('reveal-modal');
		if(typeof modal.attr('data-cookie') != "undefined"){
				mr_cookies.setItem(modal.attr('data-cookie'), "true", Infinity);
		}

		$('.modal-screen').toggleClass('reveal-modal');
});

$('.modal-screen').click(function(){
	$('.foundry_modal.reveal-modal').toggleClass('reveal-modal');
	$(this).toggleClass('reveal-modal');
});

$(document).keyup(function(e) {
 if (e.keyCode == 27) { // escape key maps to keycode `27`
	$('.foundry_modal').removeClass('reveal-modal');
	$('.modal-screen').removeClass('reveal-modal');
}
});

// Modal Strips

$('.modal-strip').each(function(){
	if(!$(this).find('.close-modal').length){
		$(this).append($('<i class="ti-close close-modal">'));
	}
	var modal = $(this);

		if(typeof modal.attr('data-cookie') != "undefined"){

				if(!mr_cookies.hasItem(modal.attr('data-cookie'))){
					setTimeout(function(){
						modal.addClass('reveal-modal');
					},1000);
				}
		}else{
				setTimeout(function(){
								modal.addClass('reveal-modal');
				},1000);
		}
});

$('.modal-strip .close-modal').click(function(){
		var modal = $(this).closest('.modal-strip');
		if(typeof modal.attr('data-cookie') != "undefined"){
				mr_cookies.setItem(modal.attr('data-cookie'), "true", Infinity);
		}
	$(this).closest('.modal-strip').removeClass('reveal-modal');
	return false;
});


// Video Modals
$('section').closest('body').find('.modal-video[video-link]').remove();

$('.modal-video-container').each(function(index) {
		$(this).find('.play-button').attr('video-link', index);
		$(this).find('.modal-video').clone().appendTo('body').attr('video-link', index);
});

$('.modal-video-container .play-button').click(function() {
		var linkedVideo = $('section').closest('body').find('.modal-video[video-link="' + $(this).attr('video-link') + '"]');
		linkedVideo.toggleClass('reveal-modal');

		if (linkedVideo.find('video').length) {
				linkedVideo.find('video').get(0).play();
		}

		if (linkedVideo.find('iframe').length) {
				var iframe = linkedVideo.find('iframe');
				var iframeSrc = iframe.attr('data-src');
				var autoplayMsg;
				if(iframeSrc.indexOf('vimeo') > -1){
					autoplayMsg = '&autoplay=1';
				}else{
					autoplayMsg = '?autoplay-1';
				}
				var iframeSrc = iframe.attr('data-src') + autoplayMsg;
				iframe.attr('src', iframeSrc);
		}
});

$('section').closest('body').find('.close-iframe').click(function() {
		$(this).closest('.modal-video').toggleClass('reveal-modal');
		$(this).siblings('iframe').attr('src', '');
		$(this).siblings('video').get(0).pause();
});



});
})(jQuery);
