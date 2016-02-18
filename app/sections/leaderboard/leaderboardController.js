(function () {
	'use-strict';

	angular.module(globals.appName + globals.controllers).controller('leaderboardController', [
       '$scope', 'leaderboardService', function ($scope, leaderboardService) {

       	$scope.$on('achievedAsset', function (event, groupValue) {
       		leaderboardService.achievedAsset($scope.leaderboard, groupValue);
       	});

       	// INIT
       	$scope.$on('leaderboard.getLeaderboard.done', function (event, data) {
       		$scope.leaderboard = data.userLeaderboards;
       		$scope.headers = leaderboardService.getLeaderboardHeaders(data.userLeaderboards);
       	});

       	$scope.$on('leaderboard.getLeaderboard.failed', function (event, data) {
       		$scope.leaderboard = null;
       	});

       	leaderboardService.getLeaderboard();
       }]);
}());