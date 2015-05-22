angular.module('HarvardCharlieApp')
// primary controller
.controller('HCAController', ['$scope', function($scope) {

	window.__Hc__ = window.__Hc__ || {};
	var Hc = window.__Hc__;

	$scope.successful_submission = false;

	$scope.submission = {

		first_name : "test",
		last_name : "test",
		email : "test",
		description_terms : "test",
		description_text : "test"

	};

	$scope.update = function(){
	}

	$scope.submit = function(){

		console.log("Submission:", $scope.submission);


		$scope.successful_submission = true;

	};

	$scope.update();




	}]);