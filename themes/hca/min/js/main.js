angular.module('hca', [])
	// configure angular templating denotation to play nice with Twig
	.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[').endSymbol(']}');
    });

angular.module('hca')
// A small directive for helping with rendering Timber twig html in angular's world 
.directive('compile', ['$compile', function ($compile) {
	return function(scope, element, attrs) {
		scope.$watch(
			function(scope) {
				return scope.$eval(attrs.compile);
			},
			function(value) {
				element.html(value);
				$compile(element.contents())(scope);
			}
		)};
	}])

// primary controller
.controller('IndexController', ['$scope', function($scope) {
	debugger;

	window.__Hc__ = window.__Hc__ || {};
	var Hc = window.__Hc__;

	$scope.submission = {};






	}]);
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



});
})(jQuery);