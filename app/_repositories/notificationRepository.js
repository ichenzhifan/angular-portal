(function () {
	'use strict';

	angular.module(globals.appName + globals.repositories).factory('notificationRepository', [
		'configModel', 'dataService', function (configModel, dataService) {
			var URL = configModel.getUrl().notification;

			function getAllNotifications(query) {
				
				return dataService.get(URL, query).then(function (response) {
					return response.data;
				});
			}

			function putIsRead(data) {
				return dataService.put(URL + '/read', data);
			}

			function putIsUnread(data) {
				return dataService.put(URL + '/unread', data);
			}

			// ?page=NUMBER&pageSize=NUMBER
			// default page = 1, pageSize = 20

			return {
			    getAllNotifications: getAllNotifications,
			    putIsRead: putIsRead,
			    putIsUnread: putIsUnread
			};
		}]);
}());