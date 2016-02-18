(function () {
    'use strict';

    angular.module(globals.appName + globals.repositories).factory('achievementRepository', [
		'configModel', 'dataService', function (configModel, dataService) {
		    function getAllBadges() {
		        return dataService.get(configModel.getUrl().user + '/badges').then(function (response) {
		            return response.data.badges;
		        });
		    }

		    return {
		        getAllBadges: getAllBadges
		    }
		}]);
}());