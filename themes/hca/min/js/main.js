var app = angular.module( 'cahl', [ 'ngMaterial', 'ngMdIcons', 'headroom' ]);

angular.module('cahl')

	.config( function( $interpolateProvider ){
		'use strict';

		// configure angular templating denotation to play nice with Twig
		$interpolateProvider.startSymbol('{[').endSymbol(']}');

	});

angular.module('cahl')
// primary controller
.controller('CAHLController', ['$scope', '$http', function($scope, $http) {

	window.__Hc__ = window.__Hc__ || {};
	var Hc = window.__Hc__;

	$scope.language = "english";
	$scope.successful_submission = false;
	$scope.submission = {

	};
	$scope.search_results = [{
				thumbnail : "/wp-content/themes/hca/min/img/submission5.jpg",
				title : "Example Submission 1",
				author : "Example Submitter",
				date : "Feb 23, 2015",
				location : "Paris, FR"
			},{
				thumbnail : "/wp-content/themes/hca/min/img/submission2.jpg",
				title : "Example Submission 2",
				author : "Example Submitter",
				date : "Jul 7, 2015",
				location : "Boston, MA, USA"
			},{
				thumbnail : "/wp-content/themes/hca/min/img/submission4.jpg",
				title : "Example Submission 3",
				author : "Example Submitter",
				date : "Jan 30, 2015",
				location : "Berlin, DE"
			},{
				thumbnail : "/wp-content/themes/hca/min/img/event_soldiers.jpg",
				title : "Example Submission 4",
				author : "Example Submitter",
				date : "Feb 2, 2015",
				location : "Paris, FR"
			},{
				thumbnail : "/wp-content/themes/hca/min/img/submission3.jpg",
				title : "Example Submission 5",
				author : "Example Submitter",
				date : "Mar 19, 2015",
				location : "Boston, MA, USA"
			},{
				thumbnail : "/wp-content/themes/hca/min/img/submission6.jpg",
				title : "Example Submission 6",
				author : "Example Submitter",
				date : "Jun 6, 2015",
				location : "Paris, FR"
		}];

	$scope.start = function(){

		if (document.cookie.indexOf("harvard_charlie_language") >= 0) {
			$scope.language = $.cookie("harvard_charlie_language");
			$(".selected-language").removeClass("selected-language");
			$(".language[data-language='" + $scope.language + "']").addClass("selected-language");

		}else{
			$.cookie("harvard_charlie_language", "english");
			$scope.language = "english";

		}
		$scope.update();
	};

	$scope.update = function(){

		if ($scope.language=="francais"){
			document.title = "Archives Charlie à Harvard";
		}else{
			document.title = "The Charlie Archive at the Harvard Library | Department of Romance Languages and Literatures and Harvard Libraries";
		}

		$scope.update_form_labels();
	};

	$scope.submit = function(){

		console.log("Submission:", $scope.submission);
		$scope.upload_files();

		$http({
				method : 'GET',
				url : '/wp-admin/admin-ajax.php',
				headers: {'Content-Type': 'application/json'},
				params : {
					language : $scope.language,
					submission : JSON.stringify($scope.submission),
					action : 'hca_send_mail'
				}
			})
			.success( function ( data ) {

				console.log("Submission success:", data);
				if ( typeof callback !== 'undefined' ) {
					callback( data );
				}

				$scope.successful_submission = true;

				$('html, body').animate({
					scrollTop: $( "#propose-submission" ).offset().top
				}, 300);

				return false;
			})
			.error( function ( e, a ) {
				console.log( 'Error with submission:', e, a );

			});

	};

	$scope.check_captcha = function(){

	}

	$scope.toggle_language = function(e){

		var $target = $(e.target)
		,	new_language = $target.data().language
		;

		$scope.language = new_language;
		$(".selected-language").removeClass("selected-language");
		$(".language[data-language='" + $scope.language + "']").addClass("selected-language");
		$.cookie("harvard_charlie_language", new_language);



		$scope.update();
	};

	$scope.update_form_labels = function( ){


		$(".wpcf7-list-item-label").each(function( i, label ){

			if ( $scope.language === "english" ){

				if ( label.textContent === "Oui" ){
					label.textContent = "Yes";

				}else if ( label.textContent === "Non" ){
					label.textContent = "No";

				}

			}else {


				if ( label.textContent === "Yes" ){
					label.textContent = "Oui";

				}else if ( label.textContent === "No" ){
					label.textContent = "Non";

				}

			}


		});




	};

	$scope.toggle_search_term = function ( term ){

		$(".search-type-" + term).toggleClass("selected");

	};




	$scope.start();



	}]);

angular.module('cahl')
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {

                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

function mr_parallax(){function a(a){for(var b=0;b<a.length;b++)if("undefined"!=typeof document.body.style[a[b]])return a[b];return null}function b(){E=void 0==window.mr_variant?!1:!0,E&&(C=$(".viu").get(0),void 0!=C&&(C.scrollBy=function(a,b){this.scrollTop+=b})),void 0!=C&&(C.addEventListener("scroll",h,!1),window.addWheelListener(C,i,!1),window.addEventListener("resize",function(){n=Math.max(document.documentElement.clientHeight,window.innerHeight||0),o=c(),D.profileParallaxElements()},!1),e())}function c(){var a=0;return a=E?$(".viu").find("nav:first").outerHeight(!0):$(document).find("nav:first").outerHeight(!0)}function d(a,b,c,d){var e=a-1;return e/=d,a/=d,e--,a--,c*(a*a*a*a*a+1)+b-(c*(e*e*e*e*e+1)+b)}function e(){if(p){for(var a=j.length,b=g();a--;)f(j[a],b);p=!1}q&&(w+=-t*d(s,0,z,B),(w>A||-A>w)&&(C.scrollBy(0,w),w=0),s++,s>B&&(s=0,q=!1,r=!0,t=0,u=0,v=0,w=0)),k(e)}function f(a,b){if(E){if(b+n>a.elemTop&&b<a.elemBottom)if(a.isFirstSection){var c="translate3d(0, "+b/2+"px, 0)";a.imageHolder.style[m]=c}else{var c="translate3d(0, "+(b-a.elemTop-o)/2+"px, 0)";a.imageHolder.style[m]=c}}else if(b+n>a.elemTop&&b<a.elemBottom)if(a.isFirstSection){var c="translate3d(0, "+b/2+"px, 0)";a.imageHolder.style[m]=c}else{var c="translate3d(0, "+(b+n-a.elemTop)/2+"px, 0)";a.imageHolder.style[m]=c}}function g(){return C!=window?C.scrollTop:0==document.documentElement.scrollTop?document.body.scrollTop:document.documentElement.scrollTop}function h(){p=!0}function i(a){a.preventDefault&&a.preventDefault(),t=a.notRealWheel?-a.deltaY/4:1==a.deltaMode?-a.deltaY/3:100===Math.abs(a.deltaY)?-a.deltaY/120:-a.deltaY/40,t=-x>t?-x:t,t=t>x?x:t,q=!0,s=y}var j,k=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,l=["transform","msTransform","webkitTransform","mozTransform","oTransform"],m=a(l),n=Math.max(document.documentElement.clientHeight,window.innerHeight||0),o=0,p=!1,q=!1,r=!0,s=0,t=0,u=0,v=0,w=0,x=2,y=4,z=300,A=1,B=30,w=0,C=window,D=this,E=void 0==window.mr_variant?!1:!0;$(document).ready(function(){"use strict";n=Math.max(document.documentElement.clientHeight,window.innerHeight||0),/Android|iPad|iPhone|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent||navigator.vendor||window.opera)?$(".parallax").removeClass("parallax"):k&&(window.mr_parallax.profileParallaxElements(),b())}),$(window).load(function(){n=Math.max(document.documentElement.clientHeight,window.innerHeight||0),o=c(),window.mr_parallax.profileParallaxElements()}),this.profileParallaxElements=function(){j=[],o=c(),selector=".parallax > .background-image-holder, .parallax ul.slides > li > .background-image-holder",E&&(selector=".viu .parallax > .background-image-holder, .viu .parallax ul.slides > li > .background-image-holder"),$(selector).each(function(a,b){var c=$(this).closest(".parallax"),d=E?c.position().top:c.offset().top;j.push({section:c.get(0),outerHeight:c.outerHeight(),elemTop:d,elemBottom:d+c.outerHeight(),isFirstSection:c.is(":first-of-type")?!0:!1,imageHolder:$(this).get(0)}),E?E&&(c.is(":first-of-type")?D.mr_setTranslate3DTransform($(this).get(0),0==g()?0:g()/2):D.mr_setTranslate3DTransform($(this).get(0),(g()-d-o)/2)):c.is(":first-of-type")?D.mr_setTranslate3DTransform($(this).get(0),0==g()?0:g()/2):D.mr_setTranslate3DTransform($(this).get(0),(g()+n-d-o)/2)})},this.mr_setTranslate3DTransform=function(a,b){a.style[m]="translate3d(0, "+b+"px, 0)"}}window.mr_parallax=new mr_parallax,function(a,b){function c(b,c,g,h){b[d](f+c,"wheel"==e?g:function(b){!b&&(b=a.event);var c={originalEvent:b,target:b.target||b.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==b.type?0:1,deltaX:0,deltaZ:0,notRealWheel:1,preventDefault:function(){b.preventDefault?b.preventDefault():b.returnValue=!1}};return"mousewheel"==e?(c.deltaY=-1/40*b.wheelDelta,b.wheelDeltaX&&(c.deltaX=-1/40*b.wheelDeltaX)):c.deltaY=b.detail/3,g(c)},h||!1)}var d,e,f="";a.addEventListener?d="addEventListener":(d="attachEvent",f="on"),e="onwheel"in b.createElement("div")?"wheel":void 0!==b.onmousewheel?"mousewheel":"DOMMouseScroll",a.addWheelListener=function(a,b,d){c(a,e,b,d),"DOMMouseScroll"==e&&c(a,"MozMousePixelScroll",b,d)}}(window,document);
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

/*!
 * Smooth Scroll - v1.4.10 - 2013-03-02
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2013 Karl Swedberg
 * Licensed MIT (https://github.com/kswedberg/jquery-smooth-scroll/blob/master/LICENSE-MIT)
 */
!function(l){function t(l){return l.replace(/(:|\.)/g,"\\$1")}var e="1.4.10",o={exclude:[],excludeWithin:[],offset:0,direction:"top",scrollElement:null,scrollTarget:null,beforeScroll:function(){},afterScroll:function(){},easing:"swing",speed:400,autoCoefficent:2},r=function(t){var e=[],o=!1,r=t.dir&&"left"==t.dir?"scrollLeft":"scrollTop";return this.each(function(){if(this!=document&&this!=window){var t=l(this);t[r]()>0?e.push(this):(t[r](1),o=t[r]()>0,o&&e.push(this),t[r](0))}}),e.length||this.each(function(){"BODY"===this.nodeName&&(e=[this])}),"first"===t.el&&e.length>1&&(e=[e[0]]),e};l.fn.extend({scrollable:function(l){var t=r.call(this,{dir:l});return this.pushStack(t)},firstScrollable:function(l){var t=r.call(this,{el:"first",dir:l});return this.pushStack(t)},smoothScroll:function(e){e=e||{};var o=l.extend({},l.fn.smoothScroll.defaults,e),r=l.smoothScroll.filterPath(location.pathname);return this.unbind("click.smoothscroll").bind("click.smoothscroll",function(e){var n=this,s=l(this),c=o.exclude,i=o.excludeWithin,a=0,f=0,h=!0,u={},d=location.hostname===n.hostname||!n.hostname,m=o.scrollTarget||(l.smoothScroll.filterPath(n.pathname)||r)===r,p=t(n.hash);if(o.scrollTarget||d&&m&&p){for(;h&&c.length>a;)s.is(t(c[a++]))&&(h=!1);for(;h&&i.length>f;)s.closest(i[f++]).length&&(h=!1)}else h=!1;h&&(e.preventDefault(),l.extend(u,o,{scrollTarget:o.scrollTarget||p,link:n}),l.smoothScroll(u))}),this}}),l.smoothScroll=function(t,e){var o,r,n,s,c=0,i="offset",a="scrollTop",f={},h={};"number"==typeof t?(o=l.fn.smoothScroll.defaults,n=t):(o=l.extend({},l.fn.smoothScroll.defaults,t||{}),o.scrollElement&&(i="position","static"==o.scrollElement.css("position")&&o.scrollElement.css("position","relative"))),o=l.extend({link:null},o),a="left"==o.direction?"scrollLeft":a,o.scrollElement?(r=o.scrollElement,c=r[a]()):r=l("html, body").firstScrollable(),o.beforeScroll.call(r,o),n="number"==typeof t?t:e||l(o.scrollTarget)[i]()&&l(o.scrollTarget)[i]()[o.direction]||0,f[a]=n+c+o.offset,s=o.speed,"auto"===s&&(s=f[a]||r.scrollTop(),s/=o.autoCoefficent),h={duration:s,easing:o.easing,complete:function(){o.afterScroll.call(o.link,o)}},o.step&&(h.step=o.step),r.length?r.stop().animate(f,h):o.afterScroll.call(o.link,o)},l.smoothScroll.version=e,l.smoothScroll.filterPath=function(l){return l.replace(/^\//,"").replace(/(index|default).[a-zA-Z]{3,4}$/,"").replace(/\/$/,"")},l.fn.smoothScroll.defaults=o}(jQuery);