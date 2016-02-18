(function () {
	'use strict';

	angular.module(globals.appName + globals.services).factory('challengeService', [
		'$rootScope', 'repoService', 'paths', 'messageService', '$q', function ($rootScope, repoService, paths, messageService, $q) {
			var challenges = [];

			/**post a challenge to another user**/
			function postChallenge(data) {
				return repoService
					.withFunction(repoService.repositories.challenge, 'postChallenge')
					.exec({
						topic: 'challenge.postChallenge',
						data: data
					}).then(function (response) {
						messageService.success("Utmaning skickad.", data.challengeUser.fullName + " har fått din utmaning! :)");
					}, function (error) {
						messageService.error("Error", response.statusText);
					});
			}

			/**get all challenges under currently user**/
			function getChallenges() {
				if (challenges.length > 0) {
					return $q.when(challenges);
				}

				return repoService
					.withFunction(repoService.repositories.challenge, 'getChallenges')
					.exec({
						topic: 'challange.getChallenges',
						skipBroadcast: true
					}).then(function (response) {
						if (!response.data.challenges)
							return [];

						// Add default user profile image if the user has none.
						_.forEach(response.data.challenges, function (challenge) {
							if (challenge.challengerUser.image === null) {
								challenge.challengerUser.image = paths.defaultImage;
							}
						});

						challenges = response.data.challenges;

						$rootScope.$broadcast('challange.getChallenges.done', challenges);
						return challenges;
					});
			}

			/**accept a challenge**/
			function acceptChallenge(data) {
				return repoService
					.withFunction(repoService.repositories.challenge, 'acceptChallenge')
					.exec({
						topic: 'challenge.acceptChallenge',
						skipBroadcast: true,
						data: { id: data.id }
					}).then(function (response) {
						// take original challenge object in broadcast.
						// add temporary date to "accepted" for gameboardService
						data.accepted = new Date();
						//$rootScope.$broadcast('challenge.acceptChallenge.done', data);
					});
			}

			/**decline a challenge**/
			function declineChallenge(data) {
				return repoService
					.withFunction(repoService.repositories.challenge, 'declineChallenge')
					.exec({
						topic: 'challenge.declineChallenge',
						skipBroadcast: true,
						data: { id: data.id }
					}).then(function (response) {
						// take original challenge object in broadcast.
						//$rootScope.$broadcast('challenge.declineChallenge.done', data);
					});
			}

			/**clear challenges*/
			function clearChallenges() {
				challenges = [];
			}

			/** Get available users to challenge**/
			function getAvailableUsers(activity) {
				return repoService
						.withFunction(repoService.repositories.user, 'getAvailableUsers')
						.exec({
							topic: 'challenge.getAvailableUsers',
							data: {
								activityId: activity.id
							}
						}).then(function (response) {
							_.forEach(response.users, function (user) {
								user.image = user.image ? user.image : paths.defaultImage;
							});
							return response.users;
						});
			}

			/**Return all new challenges*/
			function getNewChallenges(challenges) {
				return _.filter(challenges, function (item) {
					// the new challenge, its accepted property is null.
					return item.accepted === null;
				});
			}

			//#region rootScope subscriptions

			$rootScope.$on('gameboardService.challenge.expired', function (event, challenge) {
				declineChallenge(challenge);
			});

			//#endregion

			return {
				postChallenge: postChallenge,
				getChallenges: getChallenges,
				acceptChallenge: acceptChallenge,
				declineChallenge: declineChallenge,
				clearChallenges: clearChallenges,
				getNewChallenges: getNewChallenges,
				getAvailableUsers: getAvailableUsers
			};
		}]);
}());