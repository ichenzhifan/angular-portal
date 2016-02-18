(function() {
	'use strict';

	angular.module(globals.appName + globals.directives)
	/* When key "escape" is pressed, executes passed in function */
	.directive('agOnEsc', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				var keyCode = event.which ? event.which : event.keyCode;
				if (keyCode === 27) {
					scope.$apply(function () {
						scope.$eval(attrs.agOnEsc);
					});

					event.preventDefault();
				}
			});
		};
	});
}());