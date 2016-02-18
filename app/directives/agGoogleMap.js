(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('agGoogleMap', [
		function () {
			return {
				restrict: 'E', // Element directive
				templateUrl: '/app/directives/templates/agGoogleMap.html',
				scope: {
					position: '@'
				},
				transclude: true,
				link: {
					pre: function(scope, element, attrs) {
						scope.map = {
							center: {
								latitude: '59.3365382',
								longitude: '18.0334139'
							},
							zoom: 17
						};

						scope.marker = {
							id: 0,
							coords: {
								latitude: '59.3365382',
								longitude: '18.0334139'
							}
						};
					},
					post: function (scope, element, attrs) {
					var content = angular.element(element.children()[0]);
					scope.text = attrs.agGoogleMapText;
					scope.showTemplate = false;

					content.bind('mouseenter mouseleave', toggleShow);

					function toggleShow() {
						scope.$apply('showTemplate = ' + !scope.showTemplate);

						var div = angular.element(element.children()[0]).find('div')[0];
						angular.element(div).addClass(scope.showTemplate ? 'in' : 'out').removeClass(scope.showTemplate ? 'out' : 'in');

						//var elementPlacement = angular.element(div).getBoundingClientRect();

						scope.refreshMap = scope.showTemplate;
					};
				}
				}
			}
		}
	]);
}());