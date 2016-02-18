(function () {
	'use strict';

	angular.module(globals.appName + globals.services).factory('authenticationInterceptor', [
		'$rootScope', '$q', '$localStorage', function ($rootScope, $q, $localStorage) {

			var ignoreUrls =[
					'http://maps.googleapis.com/maps/api/geocode/json'
			];

			function request(config) {
				if (_.contains(ignoreUrls, config.url)) {
					return config;
				}

				config.headers = config.headers || {};
				var tokenObj = $localStorage.tokenObj;

				if (tokenObj && tokenObj.access_token) {
					config.headers.Authorization = tokenObj.token_type + ' ' + tokenObj.access_token;
					config.headers.Instance = angular.fromJson(tokenObj.instances)[0].instance;
				}

				return config;
			};

			function responseError(rejection) {
				// Unauthorized
				if (rejection.status === 401) {
					// handle the case where the user is not authenticated
					$rootScope.$broadcast('authenticationInterceptor.error.unauthorized');
				}
				return $q.reject(rejection);
			}

			return {
				request: request,
				responseError: responseError
			}
		}]);
}());