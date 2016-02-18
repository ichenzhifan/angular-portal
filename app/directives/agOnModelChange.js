(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('agOnModelChange', [
        '$animate', '$timeout', function ($animate, $timeout) {
        	return {
        		restrict: 'A',
        		link: function (scope, element, attrs) {
        			if (!attrs.onModelChange)
        				return;

        			var wait = attrs.onModelChangeTimeOut || 1000;

        			// detect outside changes and update our input
        			scope.$watch(attrs.onModelChange, function (val) {
        				//Do magic here
        				$animate.addClass(element, attrs.onModelChangeCssClass, function () {
        					$timeout(function () {
        						$animate.removeClass(element, attrs.onModelChangeCssClass);
        					}, wait);
        				});
        			}, true);
        		}
        	}
        }]);
}());