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
