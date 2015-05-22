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