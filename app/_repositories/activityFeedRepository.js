(function () {
	'use-strict';

	angular.module(globals.appName + globals.repositories).factory('activityFeedRepository', [
        'configModel', 'dataService', function (configModel, dataService) {
        	function getActivityFeed(query) {        		
        	    return dataService.get(configModel.getUrl().activityFeed, query).then(function (response) {
        			return response.data;
        		});
        	};

        	function getFilteredActivityFeed(query) {
        		return dataService.get(configModel.getUrl().activityFeed, query).then(function (response) {
        			return response.data;
        		});
        	};

        	function postComment(data) {
        		return dataService.post(configModel.getUrl().activityFeed + '/comment', data);
        	};

        	function deleteComment(data) {
        		return dataService.delete(configModel.getUrl().activityFeed + '/comment', data);
        	};

        	function postLike(data) {
        		return dataService.post(configModel.getUrl().activityFeed + '/like', data);
        	};

        	function deleteLike(data) {
        		return dataService.delete(configModel.getUrl().activityFeed + '/like', data);
        	};

        	return {
        		getActivityFeed: getActivityFeed,
        		getFilteredActivityFeed: getFilteredActivityFeed,

        		postComment: postComment,
        		deleteComment: deleteComment,

        		postLike: postLike,
        		deleteLike: deleteLike
        	}
        }]);
}());