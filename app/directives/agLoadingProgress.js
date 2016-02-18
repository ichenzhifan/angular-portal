(function () {
    'use strict';

    angular.module(globals.appName + globals.directives)

	.directive('agLoadingProgress', ['$anchorScroll', '$location', function ($anchorScroll, $location) {
	    return {
	        restrict: 'E', // element
	        replace: true,
	        scope: {
	            progressShowTopic: '@',
	            progressHideTopic: '@',
	            reachedLastPageTopic: '@'
	        },
	        templateUrl: '/app/directives/templates/agLoadingProgress.html',
	        link: function (scope, ele, attrs) {
	            var lastPageMessageContainer = angular.element(ele.children()[1]),
	                lastPageMessage = angular.element(lastPageMessageContainer.find("span")),
	                loadingContent = angular.element(ele.children()[0]),
	                lastPageMessageShowClass = "last-page-message-show",
	                progressShowClass = "p-show";

	            scope.$on(scope.progressShowTopic ? scope.progressShowTopic : 'progress.show', function (event, data) {
	                lastPageMessage.text("");
	                lastPageMessageContainer.removeClass(lastPageMessageShowClass);
	                loadingContent.addClass(progressShowClass);
	            });

	            scope.$on(scope.progressHideTopic ? scope.progressHideTopic : 'progress.hide', function (event, data) {
	                lastPageMessage.text("");
	                lastPageMessageContainer.removeClass(lastPageMessageShowClass);
	                loadingContent.removeClass(progressShowClass);
	            });

	            scope.$on(scope.reachedLastPageTopic ? scope.reachedLastPageTopic : 'reached.last.page', function (event, data) {
	                loadingContent.removeClass(progressShowClass);
	                // to hide loading content block, only show last page message block.
	                loadingContent.css("max-height", 0);
	                lastPageMessage.text(data.message);
	                lastPageMessageContainer.addClass(lastPageMessageShowClass);
	            });
	        }
	    };
	}]);
}());