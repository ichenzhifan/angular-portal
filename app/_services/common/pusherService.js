(function () {
	'use strict';

	angular.module(globals.appName + globals.services).factory('pusherService', [
		'$rootScope', 'configModel', 'accountHandler', '$window', 'urlService', function ($rootScope, configModel, accountHandler, $window, urlService) {
			var pusher = null,
				socketId = null;

			function initiate(user) {
				createPusherAndBindChannels(user);
			}

			function createPusherAndBindChannels(user) {
				var instance = accountHandler.currentInstance(),
					privateChannel,
					presenceChannel,
					endPoint = configModel.pusher.authEndpoint + '/' + user.id;

				// Enable logging
				//Pusher.log = function (message) {
				//	if (window.console && window.console.log) {
				//		window.console.log(message);
				//	}
			    //};

                // add pusher url to pace ignoreUrls list.
				$window.Pace.addIgnoreUrl(urlService.parser(endPoint).pathName);

				pusher = new Pusher(configModel.pusher.key, { authEndpoint: endPoint });
				privateChannel = pusher.subscribe('private-user_' + user.id),
                presenceChannel = pusher.subscribe('presence-instance_' + instance);

				// Get socket id
				pusher.connection.bind('connected', function () {
					socketId = pusher.connection.socket_id;

					//#region Private-user channel

					privateChannel.bind('notification.added', function(data) {
						notificationRecieved('notification.added', data);
					});

					//#region Challenge
					privateChannel.bind('challenge.added', function (data) {
						notificationRecieved('challenge.added', data);
					});

					privateChannel.bind('challenge.completed', function (data) {
						notificationRecieved('challenge.completed', data);
					});
					//#endregion

					//#region badges
					privateChannel.bind('badge.added', function (data) {
						notificationRecieved('badge.added', data);
					});
					//#endregion

					//#region Assets
					privateChannel.bind('assets.added', function (data) {
						notificationRecieved('assets.added', data);
					});
					//#endregion

					//#region Gameboard completed

					//userChannel.bind('complete_activity_in_gameboard')
					privateChannel.bind('gameboard.completed', function (activityGroup) {
						/*
						 * activityGroup = {
						 *		Completed: datetime,
						 *		Id: long,
						 *		name: string,
						 *		InstanceId: long,
						 *		UserInfoId: long
						 * }
						 */
						notificationRecieved('private.gameboard.completed', activityGroup);
					});

					//#endregion Gameboard completed

					//#endregion Private-user channel

					//#region Prescence-instance channel

					//#region Like
					presenceChannel.bind('activityFeed.like.added', function (data) {
						console.log('push received');
						notificationRecieved('activityFeed.like.added', data);
					});

					presenceChannel.bind('activityFeed.like.deleted', function (data) {
						console.log('push received');
						notificationRecieved('activityFeed.like.deleted', data);
					});
					//#endregion

					//#region Comment
					presenceChannel.bind('activityFeed.comment.added', function (data) {
						console.log('push received');
						notificationRecieved('activityFeed.comment.added', data);
					});

					presenceChannel.bind('activityFeed.comment.deleted', function (data) {
						console.log('push received');
						notificationRecieved('activityFeed.comment.deleted', data);
					});
					//#endregion

					//#region New post in activity feed
					presenceChannel.bind('activityFeed.post.added', function (data) {
						console.log('push received');
						notificationRecieved('activityFeed.post.added', data);
					});
					//#endregion

					//#endregion Prescence-instance channel
				});

				//pusher.connection.bind('state_change', function (state) {
				//	if (state.current === 'disconnected') {
				//		// TODO: check if still signedIn before connecting?
				//		if (accountHandler.signedIn()) {
				//			var user = accountHandler.getUser();
				//			pusher = new Pusher(configModel.pusher.key, { authEndpoint: configModel.pusher.authEndpoint + '/' + user.id });
				//		}
				//	}
				//});
			}

			function getSocketId() {
				return socketId;
			}

			function disconnect() {
				if (angular.isDefined(pusher) && pusher !== null)
					pusher.disconnect();
			}

			function notificationRecieved(topic, data) {
				console.log(topic, angular.fromJson(data));
				$rootScope.$broadcast('pusher.' + topic, angular.fromJson(data));
				$rootScope.$digest();
			}

			$rootScope.$on('accountHandler.signOut.done', function () {
				console.log('pusher disconnect on sign out');
				pusher.disconnect();
			});

			$rootScope.$on('accountHandler.signIn.done', function (event, user) {
				console.log('pusher connect on sign in');
				initiate(user);
			});

			$rootScope.$on('disconnect.pusher', function() {
				pusher.disconnect();
			});

			$rootScope.$on('connect.pusher', function () {
				var user = accountHandler.getUser();
				pusher = new Pusher(configModel.pusher.key, { authEndpoint: configModel.pusher.authEndpoint + '/' + user.id });
			});

			return {
			    initiate: initiate,
			    socketId: getSocketId,
			    disconnect: disconnect
			};
		}
	]);
}());