(function () {
	'use strict';

	angular.module(globals.appName + globals.services).factory('activityService', [
		'$rootScope', 'repoService', 'modalService', 'dataService', 'configModel', 'paths', 'messageService',
		function ($rootScope, repoService, modalService, dataService, configModel, paths, messageService) {

			// #region Post activity completed
			function activityCompleted(scopeFields, taggedUsers, activity) {
				return repoService
					.withFunction(repoService.repositories.activity, 'activityCompleted')
					.exec({
						topic: 'activity.completed',
						data: preparePostData(scopeFields, taggedUsers, activity)
					}).then(function (response) {
						$rootScope.$broadcast('activity.done', activity);
						response.hasError = false;
						return response;
					}, function (error) {
						messageService.error("Error", error.statusText);
						error.hasError = true;
						return error;
					});
			};

			function preparePostData(scopeFields, taggedUsers, activity) {
				var postData = {
					activityId: activity.id,
					data: {
						fields: []
					}
				};

				_.forEach(scopeFields, function (field) {
					if (field.model) {
						var valueType = (field.type === 'textarea' || field.type === 'url') ? 'text' : field.type,
							value = { type: valueType };

						value[valueType] = field.model;

						postData.data.fields.push(
							{
								name: field.name,
								value: value
							});
					}
				});

				if (taggedUsers.length > 0) {
					var users = [];
					_.forEach(taggedUsers, function (tag) {
						users.push({
							id: tag.id
						});
					});

					postData.data.fields.push(
					{
						name: 'users',
						value: {
							type: 'user',
							users: users
						}
					});
				}
				return postData;
			};

			// #endregion

			// TODO: Implement method below when option in modal will be available. (This feature is not used atm)
			//function addToPipeline(model) {
			//	$rootScope.$broadcast('activity.addToPipeline', model.activityId);
			//};

			function getActivityTabs() {
				return [
					{
						title: 'Utför', active: true, id: 1, templateUrl: 'app/sections/activity/tabs/dynamicForm.html'
					},
					{
						title: 'Utmana', active: false, id: 2, templateUrl: 'app/sections/activity/tabs/challengeForm.html'
					}
				];
			};

			// TODO: Move this to challenge service
			function getAllUsers(urlFromTemplate) {
				return repoService
					.withFunction(repoService.repositories.user, 'getAllUsersForActivities')
					.exec({
						topic: 'challenge.getAllUsers',
						data: {
							url: urlFromTemplate
						}
					}).then(function (response) {
						_.forEach(response.users, function (user) {
							user.image = user.image ? user.image : paths.defaultImage;
						});
						return response.users;
					});

				//return dataService.get('/api/challenge/' + activity.id + '/availableusers‏', null, { paceIgnore: true }).then(function (response) {
				//	_.forEach(response.data.users, function (user) {
				//		user.image = user.image ? user.image : paths.defaultImage;
				//	});
				//	return response.data;
				//});
			};

			function openActivityModal(activity) {
				var modalOptions = {
					headerText: activity.name,
					showFooter: false,
					activity: activity,
					tabs: getActivityTabs(activity.category)
				};

				var modalDefaults = {
					templateUrl: '/app/sections/activity/activityModal.html'
				};
				return modalService.showModal(modalDefaults, modalOptions);
			};

			return {
				//addToPipeline: addToPipeline,

				getActivityTabs: getActivityTabs,
				openActivityModal: openActivityModal,

				getAllUsers: getAllUsers,

				activityCompleted: activityCompleted
			}
		}]);
}());