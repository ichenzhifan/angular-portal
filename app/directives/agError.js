(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('agError', [
	function () {
		return {
			restrict: 'E', // Element directive
			templateUrl: '/app/directives/templates/agError.html',
			link: function (scope, element, attrs) {
				var topic = attrs.agTopic;

				element.addClass('col-sm-12 hidden');

				// topic.failed
				scope.$on(topic + '.failed', function (event, reason) {
					scope.error = reason.status + ' - ' + reason.statusText;
					scope.reason = reason.data.messageDetail;

					// Show the error view
					element.removeClass('hidden');
				});

				// topic.done
				scope.$on(topic + '.done', function(event, data) {
					scope.error = '';
					scope.reason = '';

					// Hide the error view
					element.addClass('hidden');
				});
			}
		}
	}]);
}());