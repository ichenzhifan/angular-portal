(function () {
	'use strict';

	angular.module(globals.appName + globals.controllers).controller('signInController', [
		'$scope', 'accountHandler', function ($scope, accountHandler) {
			$scope.signIn = function (user) {
				$scope.signingIn = true;
				accountHandler.signIn(user).finally(function() {
					$scope.signingIn = false;
				});
			};
		}
	]);
}());