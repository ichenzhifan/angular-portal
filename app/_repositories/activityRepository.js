(function () {
	'use strict';

	angular.module(globals.appName + globals.repositories).factory('activityRepository', [
		'configModel', 'dataService', function (configModel, dataService) {
			function activityCompleted(data) {
				return dataService.post(configModel.getUrl().activity + '/completed', data);
			};

			function getFormFields(activityType) {
				return dataService.getLocal('/activityForms/' + activityType + '.json').then(function (response) {
					return response.data;
				});
			};

			return {
				getFormFields: getFormFields,
				activityCompleted: activityCompleted
			}
		}]);
}());