angular.module('HarvardCharlieApp')
// primary controller
.controller('HCAController', ['$scope', '$http', function($scope, $http) {

	window.__Hc__ = window.__Hc__ || {};
	var Hc = window.__Hc__;

	$scope.language = "english";
	$scope.successful_submission = false;
	$scope.submission = {

	};

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

	};

	$scope.submit = function(){

		console.log("Submission:", $scope.submission);

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
				return false;
			})
			.error( function ( e, a ) {
				console.log( 'Error retrieving posts:', e, a );
			});



		$scope.successful_submission = true;

		$('html, body').animate({
			scrollTop: $( "#propose-submission" ).offset().top 
		}, 300);

	};

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

	$scope.start();



	}]);