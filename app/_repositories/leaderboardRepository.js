(function () {
	'use strict';

	angular.module(globals.appName + globals.repositories).factory('leaderboardRepository', [
		'configModel', 'dataService', function (configModel, dataService) {

			function getLeaderboard() {
				return dataService.get(configModel.getUrl().leaderboard).then(function (response) {
					return response.data;
				});
			};

			return {
				getLeaderboard: getLeaderboard
			}
		}]);
}());