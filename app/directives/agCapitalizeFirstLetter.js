(function () {
	'use strict';

	angular.module(globals.appName + globals.directives)
	.directive("agCapitalizeFirstLetter",
        ['$',
            function ($) {
            	return {
            		restrict: 'A',
            		require: 'ngModel',
            		link: function (scope, element, attrs) {
            			var wasCapitalized = false;

            			function capitalizeFirstLetter() {
            				var currentValue = element.val();
            				if (!currentValue) {
            					return;
            				}

            				if (wasCapitalized) {
            					return;
            				}

            				if (currentValue.length === 1) {
            					var newValue = capitalize(currentValue);
            					wasCapitalized = true;

            					element.val(newValue);
            					scope.$apply();
            				}
            			}

            			function capitalize(item) {
            				return itemIsLowerCaseLetter(item) ? item.toUpperCase() : item;
            			}

            			function itemIsLowerCaseLetter(item) {
            				return item.toUpperCase().toLowerCase() === item;
            			}

            			element.bind('keypress', capitalizeFirstLetter);
            		}
            	};
            }
        ]
    );
}());