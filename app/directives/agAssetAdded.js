(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('agAssetAdded', [
		'$rootScope', '$animate', function ($rootScope, $animate) {
			return {
				restrict: 'A', // Attribute directive
				link: function (scope, element) {
					// TODO: Change this to private channel
					scope.$on('pusher.assets.added', function () {
						$animate.addClass(element, 'asset-added', function () {
							element.removeClass('asset-added');
						});
					});
				}
			}
		}
	]);
}());