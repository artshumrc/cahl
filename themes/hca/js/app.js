angular.module('hca', [])
	// configure angular templating denotation to play nice with Twig
	.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[').endSymbol(']}');
    });
