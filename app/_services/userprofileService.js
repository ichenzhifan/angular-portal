(function () {
	'use strict';

	angular.module(globals.appName + globals.services).factory('userProfileService', [
		'$rootScope', 'repoService', function ($rootScope, repoService) {

			function getUserProfile(userId) {
				return repoService
					.withFunction(repoService.repositories.user, 'getUserProfile')
					.exec({
						topic: 'userProfile.getUserProfile',
						data: userId ? { id: userId } : null
					});
			};

			function updateUserProfile(data) {
				return repoService
					.withFunction(repoService.repositories.user, 'updateUserProfile')
					.exec({
						topic: 'userProfile.updateUserProfile',
						skipBroadcast: true,
						data: data
					}).then(function () {
						$rootScope.$broadcast('userProfile.updateUserProfile.done', data);
					});
			};

			return {
				getUserProfile: getUserProfile,
				updateUserProfile: updateUserProfile
			}
		}]);
}());