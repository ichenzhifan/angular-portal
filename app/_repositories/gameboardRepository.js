(function () {
	'use-strict';

	angular.module(globals.appName + globals.repositories).factory('gameboardRepository', [
        'configModel', 'dataService', function (configModel, dataService) {
        	function getGameboard() {
        		return dataService.get(configModel.getUrl().gameboard).then(function (response) {
        			return response.data;
        		});
        	};

        	return {
        		getGameboard: getGameboard
        	}
        }
	]);
}());