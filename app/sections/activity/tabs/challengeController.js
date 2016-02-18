(function () {
    'use strict';

    angular.module(globals.appName + globals.controllers).controller('challengeController', [
		'$scope', 'activityService', 'challengeService', function ($scope, activityService, challengeService) {
		    $scope.challengeUsers = [];
		    $scope.fields = [];
		    $scope.users = [];
		    $scope.challengeUser = null;

		    // #region For challenge
		    $scope.addUserToChallenges = function ($item) {
                // put back selected user to typeahead list.
		        if ($scope.challengeUsers.length !== 0) {
		            $scope.users.push($scope.challengeUsers[0]);
		        }
		        $scope.challengeUser = $item;
		        $scope.challengeUsers[0] = $item;
		        $scope.users.splice($scope.users.indexOf($item), 1);
		        $scope.users.sortBy("fullName");
		    };

		    $scope.removeUserFromChallenges = function (item) {
		        $scope.challengeUsers.splice(0, 1);
		        $scope.users.push(item);
		        $scope.users.sortBy("fullName");
		    };

		    $scope.postChallenge = function (activity) {
		        if ($scope.challengeUser === null)
		            return;

		        challengeService.postChallenge({
		            ChallengedUserInfoId: $scope.challengeUser.id,
		            ActivityId: activity.id,
		            challengeUser: $scope.challengeUser,
		            activity: activity
		        });
		    };

		    $scope.hasTaggedUser = function () {
		        return $scope.challengeUsers.length === 0;
		    };
		    // #endregion		   

		    function clearForm(template) {
		        _.forEach(template.fields, function (field) {
		            field.model = null;
		        });
		    }
		   
		    // INIT
		    $scope.init = function (activity) {
		        angular.extend($scope, activity.template);

		        // clear dynamic form from old values
		        clearForm(activity.template);

		        if (angular.isDefined(activity.template.userTagging) && angular.isObject(activity.template.userTagging) && activity.template.userTagging.active) {
		        	challengeService.getAvailableUsers(activity).then(function (response) {
		                $scope.users = response.sortBy("fullName");
		            });
		        }
		    };
		}]);
}());