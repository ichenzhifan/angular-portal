(function () {
    'use strict';

    angular.module(globals.appName + globals.repositories).factory('challengeRepository', [
		'configModel', 'dataService', function (configModel, dataService) {
		    function postChallenge(data) {
		        return dataService.post(configModel.getUrl().challenge, data);
		    }

		    function getChallenges() {
		        return dataService.get(configModel.getUrl().user + '/challenges');
		    }

		    function acceptChallenge(data) {
		        return dataService.put(configModel.getUrl().challenge + '/accept', data);
		    }

		    function declineChallenge(data) {
		        return dataService.put(configModel.getUrl().challenge + '/decline', data);
		    }

		    return {
		        postChallenge: postChallenge,
		        getChallenges: getChallenges,
		        acceptChallenge: acceptChallenge,
		        declineChallenge: declineChallenge
		    };
		}]);
}());