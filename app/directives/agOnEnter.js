(function () {
	'use strict';

	angular.module(globals.appName + globals.directives)
	/* When key "enter/return" is pressed, executes passed in function */
	.directive('agOnEnter', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				var keyCode = event.which ? event.which : event.keyCode;
				if (keyCode === 13) {
					scope.$apply(function () {
						scope.$eval(attrs.agOnEnter);
					});

					event.preventDefault();
				}
			});
		};
	});
}());