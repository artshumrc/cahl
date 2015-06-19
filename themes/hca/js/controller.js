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

	$scope.upload_files = function(e){

		var fd = new FormData()

		for (var i in $scope.files) {

			formData.append("action", "upload-attachment");
			fd.append("uploadedFile", $scope.files[i])
			  var fileInputElement = document.getElementById("file");
			formData.append("async-upload", fileInputElement.files[0]);
			formData.append("name", fileInputElement.files[0].name);
				
		}

		var xhr = new XMLHttpRequest()

		xhr.upload.addEventListener("progress", uploadProgress, false)
		xhr.addEventListener("load", uploadComplete, false)
		xhr.addEventListener("error", uploadFailed, false)
		xhr.addEventListener("abort", uploadCanceled, false)
		xhr.open("POST", "/fileupload")

		$scope.progressVisible = true
		xhr.send(fd)


		function uploadProgress(e) {
			$scope.$apply(function(){

				if (e.lengthComputable) {
					$scope.progress = Math.round(e.loaded * 100 / e.total);

				} else {
					$scope.progress = 'unable to compute';

				}

			});
		}

		function uploadComplete(e) {
			/* This event is raised when the server send back a response */
			alert(e.target.responseText)
		}

		function uploadFailed(e) {
			alert("There was an error attempting to upload the file.")
		}

		function uploadCanceled(e) {
			$scope.$apply(function(){
				$scope.progressVisible = false;
			})
			alert("The upload has been canceled by the user or the browser dropped the connection.")
		}

	};



	$scope.setFiles = function(element) {

		var allowed_filetypes = ["png", "jpg", "jpeg", "tiff", "tif"];

		$scope.$apply(function(scope) {

			// Turn the FileList object into an Array
			console.log('files:', element.files);
			scope.files = []

			for (var i = 0; i < element.files.length; i++) {

				for (var j = 0; j < allowed_filetypes.length; j++){
					var fname = element.files[i].name
					,	file_extension = allowed_filetypes[j]
					;

					if( fname.indexOf( file_extension, fname.length - file_extension.length ) !== -1 ){
						scope.files.push(element.files[i])
						break;
					}

				}

			}

			scope.progressVisible = false

		});
	};



	$scope.start();



	}]);