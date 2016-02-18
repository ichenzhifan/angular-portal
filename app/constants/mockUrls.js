(function () {
	'use strict';

	angular.module(globals.appName + globals.constants).constant('mockUrls', getUrls());

	function getUrls() {
		return {
			signIn: '/token',
			user: '/api/user',
			activityFeed: '/activityfeed/newsfeed.json',
			gameboard: '/gameboard/gameboard.json',
			achievements: '/achievements/achievements.json',
			activityGroups: '/gameboard/activityGroups.json',
			assets: '/assets/assets.json',
			leaderboard: '/leaderboard/leaderboard.json',
			activity: '',
			pipeline: '',
			pusher: ''
		}
	};
}());