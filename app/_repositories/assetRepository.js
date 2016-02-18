(function () {
	'use strict';

	angular.module(globals.appName + globals.repositories).factory('assetRepository', [
		'dataService', 'configModel', function (dataService, configModel) {
			function getAssets() {
				return dataService.get(configModel.getUrl().assets).then(function(response) {
					return response.data;
				});
			};

			return {
				getAssets: getAssets
			}
		}
	]);
}());