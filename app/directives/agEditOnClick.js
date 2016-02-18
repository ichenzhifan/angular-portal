(function () {
	'use strict';

	angular.module(globals.appName + globals.directives)
	/* Switches between a text string and an editable input field */
	.directive('agEditOnClick', [
		'$timeout', function ($timeout) {
			return {
				restrict: 'A',
				scope: {
					value: '=', // 2-way binding
					inputType: '@', // 1-way binding
					saveEdit: '&' // pass in function
				},
				templateUrl: 'app/directives/templates/agEditOnClick.html',
				link: function (scope, el, attrs) {
					var oldValue;
					scope.obj = { value: scope.value };

					scope.$watch("value", function (newVal) {
						if (typeof (oldValue) === "undefined" && typeof (newVal) !== "undefined") {
							oldValue = newVal;
							scope.obj.value = newVal;
						}

						scope.editing = typeof (scope.obj.value) === "undefined" || scope.obj.value === null || scope.obj.value === '';
					});

					scope.editing = false;
					scope.switchInputType = scope.inputType ? scope.inputType : 'text';

					// Object "data" must be passed in (same name) in the attribute
					// save-edit="doSomething(data)"
					scope.save = function (data) {
						scope.value = data.data;

						$timeout(function() {
							if (scope.saveEdit) {
								var tempValue = oldValue,
									functionValue = scope.saveEdit();

								if (functionValue && angular.isDefined(functionValue.then)) {
									functionValue.then(function() {
										scope.editing = false;
									}, function() {
										scope.value = tempValue;
										scope.editing = true;
									});
								}
							}
							oldValue = data.data;
							scope.toggleEdit();
						});
					};

					scope.cancel = function () {
						if (typeof (oldValue) !== "undefined" && oldValue !== null) {
							scope.obj.value = oldValue;
						} else {
							scope.obj.value = 'N/A';
						}
						scope.toggleEdit();
					};

					scope.toggleEdit = function () {
						scope.editing = !scope.editing;

						if (scope.editing) {
							// Select all text in input field
							$timeout(function () {
								var inp = el.find('input')[0];
								if (!inp)
									inp = el.find('textarea')[0];

								inp && inp.select();
							}, 1);
						}
					};
				}
			};
		}]);
}());