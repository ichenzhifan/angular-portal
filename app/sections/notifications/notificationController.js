(function () {
	'use strict';

	angular.module(globals.appName + globals.controllers).controller('notificationController', [
		'$scope', 'dateHelperService', 'accountHandler', 'messageService', 'notificationService',
		function ($scope, dateHelperService, accountHandler, messageService, notificationService) {
		    var currentPage = 1,
		        totalPage = 1;

			$scope.$watch('notifications', function (newValue) {
				if (newValue && newValue.length === 0) {
					$scope.ddStatus.notificationsOpen = false;
				}
				$scope.ddStatus.notificationsDisabled = $scope.notifications.length === 0;
			}, true);

			$scope.switchReadStatus = function (notification, $event) {
			    $event.stopPropagation();

			    if (notification.isRead) {
			        notificationService.putIsUnread(notification.id).then(function () {
			            $scope.noOfUnreadNotifications++;
			        });
			    } else {
			        notificationService.putIsRead(notification.id).then(function () {
			            $scope.noOfUnreadNotifications--;
			        });
			    }

			    notification.isRead = !notification.isRead;
			};

			$scope.ddStatus = {
				notificationsOpen: false,
				notificationsDisabled: true
			};

			$scope.$on('accountHandler.signIn.done', function () {
				getNotifications();
			});

			$scope.$on('accountHandler.signOut.done', function () {
				resetScopeData();
			});

			$scope.$on('pusher.notification.added', function (event, data) {
				$scope.notifications.push(data);
				$scope.noOfUnreadNotifications++;
			});

			$scope.$on('not.hit.bottom', function (event, data) {
			    if (currentPage <= totalPage) {
			        getNotifications();
			    }
			});
			//#endregion

			//#region private
			function resetScopeData() {
				$scope.notifications = [];
				$scope.noOfUnreadNotifications = 0;
			}

			function getNotifications() {			    
				return notificationService.getAllNotifications(currentPage).then(function (data) {
					$scope.notifications.pushRange(data.notifications);
					$scope.noOfUnreadNotifications = data.unreadNotificationsCount;
					currentPage++;
					totalPage = data.totalPages;
				});
			}
			//#endregion

			//INIT
			if (accountHandler.signedIn()) {
				getNotifications();
			}

			resetScopeData();
		}]);
}());