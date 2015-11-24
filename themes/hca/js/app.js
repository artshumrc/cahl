var app = angular.module( 'cahl', [ 'ngMaterial', 'ngMdIcons', 'headroom' ]);

angular.module('cahl')

	.config( function( $interpolateProvider ){
		'use strict';

		// configure angular templating denotation to play nice with Twig
		$interpolateProvider.startSymbol('{[').endSymbol(']}');

	});
