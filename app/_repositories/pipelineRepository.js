(function () {
	'use strict';

	angular.module(globals.appName + globals.repositories).factory('pipelineRepository', [
		'$rootScope', 'configModel', 'dataService', function ($rootScope, configModel, dataService) {

			function getPipeline() {
				return dataService.get(configModel.getUrl().pipeline).then(function (response) {
					return response.data;
				});
			};

			function postActivityToPipeline(data) {
				return dataService.post(configModel.getUrl().pipeline + '/activity', data);
			};

			function putActivityPosition(data) {
				return dataService.put(configModel.getUrl().pipeline + '/activity', data);
			};

			function deleteActivityFromPipeline(data) {
				return dataService.delete(configModel.getUrl().pipeline + '/activity', data);
			};

			function putEndDate(data) {
				return dataService.put(configModel.getUrl().pipeline, data);
			};

			return {
				getPipeline: getPipeline,
				postActivity: postActivityToPipeline,
				putActivityPosition: putActivityPosition,
				deleteActivity: deleteActivityFromPipeline,
				putEndDate: putEndDate
			}
		}
	]);
}());