(function () {
    'use strict';

    angular.module(globals.appName + globals.controllers).controller('userProfileController',
	['$scope', 'userProfileService', 'messageService', 'paths', '$routeParams', 'modalService',
        function ($scope, userProfileService, messageService, paths, $routeParams, modalService) {
	        var userId = $routeParams.userId;

			$scope.updateUserProfile = function () {
                return userProfileService.updateUserProfile($scope.userProfile).then(function (response) {
                	messageService.success('Info', 'Din profil är uppdaterad.');
                });
			};

	        $scope.viewLargerImage = function() {
		        var options = {
			        headerText: $scope.userProfile.fullName,
			        imgSrc: $scope.userProfile.image
		        };

		        modalService.showModal({}, options);
	        };

			// Subscriptions
            $scope.$on('userProfile.imageUpload.done', function (event, data) {              
                $scope.userProfile.image = data.image;
                messageService.success('Info', 'Din profil är uppdaterad.');
            });

            // INIT
            userProfileService.getUserProfile(userId).then(function (userProfile) {

            	$scope.userProfile = userProfile.user;
                // set default icon if haven't.              
                $scope.userProfile.image = $scope.userProfile.image ? $scope.userProfile.image : paths.defaultImage;
            });
        }]);
}());