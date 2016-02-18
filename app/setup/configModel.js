(function () {
	'use-strict';
	angular.module(globals.appName + globals.services).factory('configModel', [
		'$rootScope',
		'$injector',
		'$templateCache',
		'cachedTemplates',
		function (
		$rootScope,
		$injector,
		$templateCache,
		cachedTemplates) {
			var config = {
				initialize: function () {
					cachedTemplates.init();
				},

				configure: function () {
				},

				getUrl: function () {
					return $injector.get('apiUrls');
				},
				debug: true,
				userImageSize: {
				    min: 10,
                    max: 2048
				},
				defaultTheme: 'skin-blur-chrome',
				baseUrl: 'http://awesome-proxy.azurewebsites.net',
				localUrl: '/localData',
				pusher: {
					app_id: '90673',
					key: '37d88c40fc4fe332ba7f',
					secret: '6a5b30cbb1c372c6402d',
					authEndpoint: 'http://awesome-proxy.azurewebsites.net/api/push/token'
				}
			};

			config.initialize();

			if (config.debug) {
				angular.$debugRootScope = $rootScope;
			}

			return config;
		}]);
}());