(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('agGameboardCompleted', [
		'$rootScope', '$animate', 'messageService', function ($rootScope, $animate, messageService) {
			return {
				restrict: 'A', // Attribute directive
				scope: {
					activityGroupId: '@' // one-way binding
				},
				link: function (scope, element) {
					scope.$on('pusher.private.gameboard.completed', function (event, activityGroup) {
						var id = parseInt(scope.activityGroupId);

						if (id === activityGroup.id) {
							messageService.success('Grattis! Du har klarat av brädet "' + activityGroup.name + '!', 'Brädet är nu nollställt och du kan börja om på nytt för att tjäna in nya stenar!', { timeout: 7500 });
							$animate.addClass(element, 'glow', function () {
								element.removeClass('glow');
							});
						} else {
							$animate.addClass(element, 'blur', function () {
								element.removeClass('blur');
							});
						}
					});
				}
			}
		}
	]);
}());