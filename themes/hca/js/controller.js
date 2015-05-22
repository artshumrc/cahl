angular.module('HarvardCharlieApp')
// primary controller
.controller('HCAController', ['$scope', function($scope) {

	window.__Hc__ = window.__Hc__ || {};
	var Hc = window.__Hc__;

	$scope.submission = {};

	$scope.check_send = function(e){

		console.log("Submission:", $scope.submission);





	};





	}]);