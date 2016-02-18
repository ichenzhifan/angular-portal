/******** app.js
************************/
var globals = {
	appName: 'app',
	services: '.services',
	repositories: '.repositories',
	directives: '.directives',
	controllers: '.controllers',
	filters: '.filters',
	constants: '.constants'
};

(function (window) {
	'use strict';

	// Declare app level module which depends on filters, and services
	var app = angular.module(globals.appName, [
      // Angular modules
      'ngAnimate',
      'ngRoute',
      'ngSanitize',

      // 3rd party angular modules
      'ui.bootstrap',
      'ngStorage',
	  'toaster',
	  //'google-maps',
      'angularFileUpload',
	  'angular.filter',
	  'monospaced.mousewheel',

      // Custom services
      'pickadate',
      'mgcrea.ngStrap.popover',
	  'mgcrea.ngStrap.typeahead',
	  'mgcrea.ngStrap.helpers.parseOptions',

      'app.services',
      'app.repositories',
      'app.directives',
      'app.controllers',
      'app.filters',
	  'app.constants'
	]);

	app.run(['$route', 'configModel', 'accountHandler', 'pusherService', '$location', 'authenticationInterceptor', function ($route, configModel, accountHandler, pusherService, $location, authenticationInterceptor) {
		// Include $route to kick start the router.
		if (!accountHandler.signedIn()) {
			pusherService.disconnect();
			$location.path('/signIn');
		} else {
			accountHandler.getUser().then(function (user) {
				pusherService.initiate(user);
				configModel.configure();
			});
		}
	}]);

	app.config(['$httpProvider', '$tooltipProvider', '$popoverProvider', function ($httpProvider, $tooltipProvider, $popoverProvider) {
		$httpProvider.interceptors.push('authenticationInterceptor');

		// Tooltip defaults
		angular.extend($tooltipProvider.defaults, {
			container: 'body',
			placement: 'bottom',
			trigger: 'hover',
			html: true
		});

		// Popover defaults
		angular.extend($popoverProvider.defaults, {
			container: 'body',
			placement: 'left',
			trigger: 'hover',
			html: true
		});
	}]);

	// bootstrap
	window.document.addEventListener('DOMContentLoaded', function () {
		angular.bootstrap(window.document, [globals.appName]);
	}, false);
}(window));