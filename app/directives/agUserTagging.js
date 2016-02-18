(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('agUserTagging', [
		'$timeout', '$rootScope', function ($timeout, $rootScope) {
			return {
				restrict: 'E',
				scope: {
					value: '=ngModel',
					realValue: '='
				},
				template: '<div class="row" id="testar" ng-show="startFiltering">' +
					'<input class="form-control col-sm-4" ng-model="searchString" typeahead="user.name for user in users | filter:searchString | limitTo:8" typeahead-on-select="selectName($item)" type="text" />' +
					'</div>',
				link: function (scope, element, attrs) {
					scope.users = angular.fromJson(attrs.agUserTaggingSource);
					scope.startFiltering = false;

					scope.$watch('value', function (newValue) {
						if (newValue.indexOf('@') !== -1) {
							scope.startFiltering = true;
							scope.searchString = newValue.substr(newValue.indexOf('@') + 1, newValue.length);

							$timeout(function () {
								element.children().children()[0].focus();
							}, 1);
						}
						else {
							scope.startFiltering = false;
						}
					});

					scope.selectName = function (item) {
						$rootScope.$broadcast('user.tagged', item);

						scope.value = scope.value.replace('@', item.name);
						
						_.each(scope.users, function (user) {
							scope.realValue = scope.realValue.replace(user.name, '{ "id": "' + user.userId + '", "name": "' + user.name + '" }');
						});

						// Mega-ful-hack för att sätta fokus i textarea igen
						element.parent()[0].children[0].focus();
					};
				}
			}
		}
	]);
}());