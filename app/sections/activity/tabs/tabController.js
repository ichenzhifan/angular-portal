(function () {
	'use strict';

	angular.module(globals.appName + globals.controllers).controller('tabController', [
		'$scope', 'activityService', 'dataService', '$window', function ($scope, activityService, dataService, $window) {
			$scope.tagUser = '';
			$scope.taggedUserPristine = true;
			$scope.taggedUsers = [];
			$scope.fields = [];
			$scope.isPosting = false;
			$scope.isPosted = false;
			$scope.isTaggedUsersOk = true;

			var withUserTagging = false,
				userTaggingMandatory = false;

			$scope.activityCompleted = function (activity, closeModal) {
				if ($scope.isPosting)
					return;

				$scope.isPosting = true;
				activityService.activityCompleted($scope.fields, $scope.taggedUsers, activity)
                    .then(function (response) {
                    	// hide refresh icon
                    	$scope.isPosting = false;

                    	// disable ok button to avoid user submit it again.
                    	$scope.isPosted = true;

                    	// if no error, close modal.
                    	if (!response.hasError) {
                    		closeModal(true);
                    	}
                    });
			};

			// #region For user tagging
			$scope.addUserTag = function ($item) {
				$scope.users.splice($scope.users.indexOf($item), 1);
				$scope.taggedUsers.push($item);
				$scope.taggedUserPristine = false;
				$scope.isTaggedUsersOk = true;
				$scope.tagUser = '';
			};

			$scope.removeUserTag = function (item) {
				$scope.taggedUsers.splice($scope.taggedUsers.indexOf(item), 1);
				$scope.users.push(item);
				$scope.users.sortBy("fullName");
				$scope.isTaggedUsersOk = $scope.taggedUsers.length > 0;
			};

			// #endregion

			//#region Google maps address/position
			$scope.getAddress = function (address) {
				var obj = { address: address, sensor: !1, region: 'SE' };
				return dataService.getExternal("http://maps.googleapis.com/maps/api/geocode/json", { params: obj }).then(function (response) {
					return response.data.results;
				});
			};
			//#endregion

			// #region watch.
			// When the user updates any form fields, set isPosted to false to enable the submit button.
			$scope.$watch("formName.$invalid", function (old, newv) {
				$scope.isPosted = false;
			});

			// When the user changes adds or removes a tagged user, set isPosted to false to enable the submit button.
			$scope.$watch("isTaggedUsersOk", function (old, newv) {
				$scope.isPosted = false;
			});
			// #endregion

			function clearForm(template) {
				_.forEach(template.fields, function (field) {
					field.model = null;
				});
			};

			// INIT
			$scope.init = function (activity) {
                // TODO, change link to url in template, this would be updated in template of server side.
				var linkfield = _.findWhere(activity.template.fields, { name: 'link' });
				if (linkfield) {
					linkfield.type = 'url';
				}
				angular.extend($scope, activity.template);

				// Clear dynamic form from old values
				clearForm(activity.template);

				if (angular.isDefined(activity.template.userTagging) && angular.isObject(activity.template.userTagging) && activity.template.userTagging.active) {
					withUserTagging = true;
					userTaggingMandatory = $scope.userTagging.mandatory;

					// Disable taggedUserOk if mandatory is required.
					// and it will be enabled again when selected user in typeahead.
					if (userTaggingMandatory) {
						$scope.isTaggedUsersOk = false;
					}

					activityService.getAllUsers(activity.template.userTagging.url).then(function (response) {
						$scope.users = response.sortBy("fullName");
					});
				}
			};
		}]);
}());