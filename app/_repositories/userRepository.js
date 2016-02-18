(function () {
	'use strict';

	angular.module(globals.appName + globals.repositories).factory('userRepository', [
		'configModel', 'dataService', function (configModel, dataService) {
			function getAllUsers() {
				return dataService.get(configModel.getUrl().user + '/all').then(function (response) {
					return response.data;
				});
			};

			function getAllUsersForActivities(data) {
				return dataService.get('/' + data.url).then(function (response) {
					return response.data;
				});
			}

			function getAvailableUsers(data) {
				return dataService.get(configModel.getUrl().challenge + '/availableusers/', data, { paceIgnore: true }).then(function (response) {
					return response.data;
				});
			}

			function getUserProfile(data) {
				return dataService.get(configModel.getUrl().user, data).then(function (response) {
					return response.data;
				});
			};

			function updateUserProfile(data) {
				return dataService.put(configModel.getUrl().user, data).then(function (response) {
					return response.data;
				});
			};
			return {
				getAllUsers: getAllUsers,
				getAllUsersForActivities: getAllUsersForActivities,
				getAvailableUsers: getAvailableUsers,
				getUserProfile: getUserProfile,
				updateUserProfile: updateUserProfile
			}
		}]);
}());