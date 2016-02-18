(function () {
	'use strict';

	angular.module(globals.appName + globals.constants).constant('apiUrls', getUrls());

	function getUrls() {
		return {
			signIn: '/token',
			user: '/api/user',
			activityFeed: '/api/activityfeed',
			gameboard: '/api/gamestructure',
			activityGroups: '/api/activityGroups',
			assets: '/api/assets',
			leaderboard: '/api/leaderboard',
			activity: '/api/activity',
			pipeline: '/api/pipeline',
			pusher: '/api/push',
			challenge: '/api/challenges',
			notification: '/api/notifications'
		}
	};
}());