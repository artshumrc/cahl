angular.module('cahl')
// primary controller
.controller('CAHLController', ['$scope', '$http', function($scope, $http) {

	window.__Hc__ = window.__Hc__ || {};
	var Hc = window.__Hc__;

	$scope.language = "francais";
	$scope.successful_submission = false;
	$scope.submission = {

	};
	$scope.search_results = [];
	$scope.more_to_show = true;
	$scope.results_masonry_inited = false;
	$scope.gallery_masonry_inited = false;

	$scope.init = function(){

		if (document.cookie.indexOf("harvard_charlie_language") >= 0) {
			$scope.language = $.cookie("harvard_charlie_language");
			$(".selected-language").removeClass("selected-language");
			$(".language[data-language='" + $scope.language + "']").addClass("selected-language");

		}else{
			$.cookie("harvard_charlie_language", "francais");
			$scope.language = "francais";

		}

		$scope.query 	= {
						post_type	: 'submission',
						post_status : 'publish',
						showposts : 9,
						paged : 0,
						order : 'ASC',
						orderby : 'post_date'
					};
		$scope.request = [ 'ID', 'post_title', 'post_name', 'post_content', 'donated_by', 'location', 'images'];


		$scope.update();
	};

	$scope.update = function(){

		if ($scope.language=="francais"){
			document.title = "Archives Charlie à Harvard";
		}else{
			document.title = "The Charlie Archive at the Harvard Library | Department of Romance Languages and Literatures and Harvard Libraries";
		}

		$(".cahl-loading-modal").fadeIn();

		$http({
				method : 'GET',
				url : '/wp-admin/admin-ajax.php',
				headers: {'Content-Type': 'application/json'},
				params : {
					request_args : $scope.request.join(","),
					post_query : $scope.query,
					action : 'hca_get_posts'
				}
			})
			.then( function ( res ) {

				var data = res.data;
				$scope.search_results.push.apply( $scope.search_results, data.posts );

				if(data.posts.length < $scope.query.showposts){
					$scope.more_to_show = false;
				}
				setTimeout(function(){

					if( $scope.results_masonry_inited){
						$(".results-grid").masonry('destroy');

					}

					$(".results-grid").masonry({
						itemSelector: ".submission-teaser"
					});

					$scope.results_masonry_inited = true;
					$(".cahl-loading-modal").fadeOut();

				},2000);


			}, function ( e, a ) {
				console.log( 'Error with query:', e, a );

			});

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


	$scope.show_single = function ( e ){
		var $target = $(e.target)
		,		target_id
		;
		if( !$target.hasClass("submission-teaser") ){
			$target = $target.parents(".submission-teaser");

		}

		$(".cahl-loading-modal").fadeIn();

    $('html, body').animate({
        scrollTop: $("#recent-submissions").offset().top
    }, 300);

		target_id = $target.data().id;

		$scope.search_results.forEach(function(result){

			if ( result.ID === target_id ){
				$scope.selected_result = result;
			}

		});

		if ( $scope.selected_result.images.length > 3 ){

			setTimeout(function(){

				if( $scope.gallery_masonry_inited ){
					$(".gallery-images").masonry('destroy');
					$scope.gallery_masonry_inited = false;

				}
				$(".gallery-images").masonry({
					itemSelector: ".gallery-image"
				});
				$scope.gallery_masonry_inited = true;

				$(".cahl-loading-modal").fadeOut();

			},1000)

		}else {

			$(".cahl-loading-modal").fadeOut();

		}

	};

	$scope.close_single = function ( e ){
		$(".cahl-loading-modal").fadeIn();
		$scope.selected_result = null;
		if( $scope.gallery_masonry_inited ){
			$(".gallery-images").masonry('destroy');
			$scope.gallery_masonry_inited = false;
		}


		setTimeout(function(){
			$(".results-grid").masonry('destroy');
			$(".results-grid").masonry({
				itemSelector: ".submission-teaser"
			});

			$(".cahl-loading-modal").fadeOut();

		},1000)

	};

	$scope.show_more = function(){
		$scope.query.paged = $scope.query.paged + 1;
		$scope.update();


	};

	$scope.show_image_modal = function(e){
		var $target = $(e.target)
		,		image_url = ""
		;

		if(!$target.hasClass("image-modal-link")){
			$target = $target.parents(".image-modal-link");
		}

		image_url = $target.data().imageUrl;

		$(".image-modal-image").css("background-image", "url(" + image_url + ")");
		$(".cahl-image-modal").fadeIn();
		e.preventDefault();


	};

	$scope.close_image_modal = function(){
		$(".cahl-image-modal").fadeOut();

	};


	$scope.init();



}]);
