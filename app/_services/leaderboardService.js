(function () {
	'use-strict';
	angular.module(globals.appName + globals.services).factory('leaderboardService', [
        '$rootScope', 'repoService', 'accountHandler', 'paths', function ($rootScope, repoService, accountHandler, paths) {
        	var user;

        	function achievedAsset(leaderboardRows, groupValue) {
        		var row = _.find(leaderboardRows, function (item) { return item.user.id === user.id; });
        		_.findWhere(row.assets, { activityGroupValue: groupValue }).score++;
        		row.score++;
        	};

        	function getLeaderboard() {
        		repoService
				    .withFunction(repoService.repositories.leaderboard, 'getLeaderboard')
				    .exec({
				        topic: 'leaderboard.getLeaderboard',
				        skipBroadcast:true
				    }).then(function (response) {
				        _.forEach(response.userLeaderboards, function (leaderboard) {
				            if (leaderboard.user.image == null) {
				                leaderboard.user.image = paths.defaultImage;
				            }
				        });
				        $rootScope.$broadcast('leaderboard.getLeaderboard.done', response);
				    });
        	};

        	function getLeaderboardHeaders(data) {
        		var headers = [];
        		_.each(_.first(data).assets, function (asset) {
        			headers.push({ activityGroupId: asset.activityGroupId, name: asset.name, activityGroupValue: asset.activityGroupValue });
        		});

        		return headers;
        	};

			// INIT
        	accountHandler.getUser().then(function (response) {
        		user = response;
        	});

        	return {
        		achievedAsset: achievedAsset,
        		getLeaderboard: getLeaderboard,
        		getLeaderboardHeaders: getLeaderboardHeaders
        	}
        }]);
}());