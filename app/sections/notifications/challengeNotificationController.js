(function () {
	'use strict';

	angular.module(globals.appName + globals.controllers).controller('challengeNotificationController', [
		'$scope', '$timeout', 'challengeService', 'dateHelperService', 'accountHandler', 'messageService',
		function ($scope, $timeout, challengeService, dateHelperService, accountHandler, messageService) {
			$scope.$watch('challenges', function (newValue) {
				if (newValue && newValue.length === 0) {
					closeDropdown();
				}
				setDisabledDropdown();
			}, true);

			$scope.acceptChallenge = function ($event, challenge) {
			    $event.preventDefault();
			    $event.stopPropagation();

				challengeService.acceptChallenge(challenge).then(function () {
				    var itemIndex = $scope.unreadChallenges.indexBy(challenge, "id");

					itemIndex !== -1 && $scope.unreadChallenges.splice(itemIndex, 1);
					$scope.challenges.removeItem(challenge);
				});
			};

			$scope.declineChallenge = function ($event, challenge) {
			    $event.preventDefault();
			    $event.stopPropagation();

				challengeService.declineChallenge(challenge).then(function () {
				    var itemIndex = $scope.unreadChallenges.indexBy(challenge, "id");

					itemIndex !== -1 && $scope.unreadChallenges.splice(itemIndex, 1);
					$scope.challenges.removeItem(challenge);
				});
			};		   

			$scope.hasExpired = function (challenge) {
				// get challenge expiration.
				var expiration = dateHelperService.toDate(challenge.expiration);

				// check if greater than or equals currently date.
				return dateHelperService.greaterThan(new Date(), expiration);
			};

			$scope.ddStatus = {
				challengesOpen: false,
				challengesDisabled: true
			};

			function setDisabledDropdown() {
				$scope.ddStatus.challengesDisabled = $scope.challenges.length === 0;
			}

			function closeDropdown() {
				$scope.ddStatus.challengesOpen = false;
			}

			function extend(data) {
				angular.extend(data, { unread: true });
			};

			//#region Subscriptions

			//#region Challanges
			$scope.$on('pusher.challenge.added', function (event, data) {
				$scope.challenges.push(data);
				$scope.unreadChallenges.push(data);
				messageService.info("Ny utmaning!", "Du har blivit utmanad av " + data.challengerUser.fullName + '!');
			});

			$scope.$on('pusher.challenge.completed', function (event, data) {
				extend(data);

				//TODO, need to discuss what's info would be shown in notification.
				// currently, the pusher notification only pass back "message" property.
				$scope.unreadNotifications.push(data);
				$scope.notifications.push(data);
				messageService.success("Utmaning klarad!", "Du har just klarat en utmaning.");
			});

			//$scope.$on('challenge.acceptChallenge.done', function (event, data) {
			//	var itemIndex = $scope.unreadChallenges.indexBy(data, "id");

			//	itemIndex !== -1 && $scope.unreadChallenges.splice(itemIndex, 1);
			//	$scope.challenges.removeItem(data);
			//});

			//$scope.$on('challenge.declineChallenge.done', function (event, data) {
			//	var itemIndex = $scope.unreadChallenges.indexBy(data, "id");

			//	itemIndex !== -1 && $scope.unreadChallenges.splice(itemIndex, 1);
			//	$scope.challenges.removeItem(data);
			//});
			//#endregion Challanges

			$scope.$on('accountHandler.signIn.done', function () {
				getChallenges();
			});

			$scope.$on('accountHandler.signOut.done', function () {
				resetScopeData();
				challengeService.clearChallenges();
			});

			//#endregion

			//#region private
			function getChallenges() {
				challengeService.getChallenges().then(function (response) {
					// only displays new challenges in list, here will filter accepted ones.
					$scope.challenges = challengeService.getNewChallenges(response);
					$scope.unreadChallenges = angular.copy($scope.challenges);
				});
			}

			function resetScopeData() {
				$scope.challenges = [];
				$scope.unreadChallenges = [];
			}
			//#endregion

			//INIT
			if (accountHandler.signedIn()) {
				getChallenges();
			}

			resetScopeData();
		}]);
}());