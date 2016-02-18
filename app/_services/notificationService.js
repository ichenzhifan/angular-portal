(function () {
    'use strict';

    angular.module(globals.appName + globals.services).factory('notificationService', [
		'$rootScope', 'repoService', 'dataService', 'configModel', function ($rootScope, repoService, dataService, configModel) {
		    var REPOSITORY = repoService.repositories.notification;

		    function getAllNotifications(page) {
		        var data = {
		                page: page ? page : 1,
		                pageSize: 10
		            },
		            options = {
		                paceIgnore: true
		            };
                
		        $rootScope.$broadcast("not.progress.show", {});
		        return dataService.get(configModel.getUrl().notification, data, options).then(function (response) {
		            var data = response.data;
		            $rootScope.$broadcast('notifications.getAll.done', data);
		            $rootScope.$broadcast("not.progress.hide", {});

		            if (data && data.totalPages === page) {
		                $rootScope.$broadcast("not.last.page", { message: "No more notifications" });
		            }

		            return {
		                notifications: data.notifications,
		                unreadNotificationsCount: data.unreadNotificationsCount,
		                currentPage: page,
                        totalPages: data.totalPages
		            };
		        });
		    }

		    function putIsRead(notificationId) {
		        return repoService
					.withFunction(REPOSITORY, 'putIsRead')
					.exec({
					    topic: 'notifications.isread',
					    data: { id: notificationId }
					});
		    }

		    function putIsUnread(notificationId) {
		        return repoService
					.withFunction(REPOSITORY, 'putIsUnread')
					.exec({
					    topic: 'notifications.isunread',
					    data: { id: notificationId }
					});
		    }

		    return {
		        getAllNotifications: getAllNotifications,
		        putIsRead: putIsRead,
		        putIsUnread: putIsUnread
		    };
		}]);
}());