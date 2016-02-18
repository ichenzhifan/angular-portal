(function () {
	'use strict';

	angular.module(globals.appName + globals.controllers).controller('settingsController', [
		'$scope', '$rootScope', '$localStorage', 'configModel', 'accountHandler',
		function ($scope, $rootScope, $localStorage, configModel, accountHandler) {
			$rootScope.selectedTheme = $localStorage.theme;
			$scope.signedIn = accountHandler.signedIn();
			$scope.imgPath = '../Content/images/body/';

			if (!$rootScope.selectedTheme) {
				$rootScope.selectedTheme = 'skin-blur-chrome';
				$localStorage.theme = 'skin-blur-chrome';
			}

			$scope.themes = [
				'violate',
				'lights',
				'city',
				'greenish',
				'night',
				'sunny',
				'blue',
				'chrome',
				'ocean',
				'sunset',
				'yellow',
				'kiwi'
			];

			/* Functions */
			$scope.changeTheme = function (theme) {
				$rootScope.selectedTheme = 'skin-blur-' + theme;
				$localStorage.theme = 'skin-blur-' + theme;
			};

			// Subscriptions
			$scope.$on('accountHandler.signIn.done', function () {
				$scope.signedIn = true;
			});

			$scope.$on('accountHandler.signOut.done', function () {
				$scope.signedIn = false;
			});

			$scope.$on('userProfile.updateUserProfile.done', function (event, data) {
				accountHandler.updateUserData(data);
			});

			$scope.$on('modal.is.visible', function (event, value) {
				$scope.modalVisible = value;
			});
		}]);
}());