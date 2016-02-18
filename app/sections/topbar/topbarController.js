(function () {
	'use strict';

	angular.module(globals.appName + globals.controllers).controller('topbarController', [
		'$scope', 'modalService', 'accountHandler', function ($scope, modalService, accountHandler) {
			$scope.openSettings = function () {
				modalService.showModal({ templateUrl: '/app/sections/settings/settingsModal.html' }, { showFooter: true, size: 'lg' });
			};

			$scope.signOut = function () {
				accountHandler.signOut();
			};

			/* Subscriptions */
			$scope.$on('accountHandler.signIn.done', function (event, user) {
				$scope.user = user;
			});

			$scope.$on('accountHandler.signOut.done', function () {
				$scope.user = null;
			});

			$scope.$on('userProfile.imageUpload.done', function (event, data) {
				$scope.user.image = data.image;
			});

			// INIT
			accountHandler.getUser().then(function (user) {
				$scope.user = user;
			});
		}]);
}());