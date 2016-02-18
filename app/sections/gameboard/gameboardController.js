(function () {
	'use-strict';

	angular.module(globals.appName + globals.controllers).controller('gameboardController', [
        '$scope', 'modalService', 'gameboardService', 'activityService', function ($scope, modalService, gameboardService, activityService) {
            var challenges = [];
            // AEP-277: Maximum of dots below activities should be 3
            $scope.maxCompletions = 3;

        	$scope.dropped = function (data, activityGroupId) {
        		gameboardService.droppedInGameboard(data.activityId, activityGroupId);
        	};

        	$scope.open = function (activity) {
        		activityService.openActivityModal(activity);
        	};

        	$scope.buildCustomData = function (activityId, activityGroupId) {
        		return angular.toJson({ activityId: activityId, groupId: activityGroupId });
        	};

        	$scope.popoverTrigger = function (activity) {
        		return activity.isChallenged ? 'manual' : 'hover';
        	}

        	//#region Lines
        	$scope.oneLine = gameboardService.oneLine;

        	$scope.twoLines = gameboardService.twoLines;

        	$scope.threeLines = gameboardService.threeLines;
        	//#endregion

        	//#region Subscriptions

        	$scope.$on('activity.done', function (event, activity) {
        		gameboardService.activityDone(activity);
        	});

        	$scope.$on('pipeline.activity.dropped', function (event, activityId) {
        		gameboardService.togglePipelineStatus(activityId, true);
        	});

        	$scope.$on('pipeline.activity.removed', function (event, activityId) {
        		gameboardService.togglePipelineStatus(activityId, false);
        	});

        	$scope.$on('challenge.acceptChallenge.done', function (event, challenge) {
        		gameboardService.toggleIsChallanged(challenge);
        	});

        	$scope.$on('challange.getChallenges.done', function (event, data) {
        		challenges = data ? data : [];
        		gameboardService.checkAllActivitiesForChallangeStatus(challenges);
        	});

        	$scope.$on('pipeline.getPipeline.done', function (event, data) {
        		gameboardService.checkIfInPipeline(data.activitiesInPipeline);
        	});

        	$scope.$on('gameboard.countDown.finished', function (event, jsonActivity) {
        		var activity = angular.fromJson(jsonActivity);

        	});

            //AEP-280: "When gameboard is completed the completed gameboard should be cleared".
        	$scope.$on('pusher.private.gameboard.completed', function (event, data) {
        	    gameboardService.resetActivities($scope.activityGroups, data.activityGroupId);
        	});

        	//#endregion

        	// INIT
        	gameboardService.getGameboard().then(function (response) {
        		$scope.activityGroups = response;

        		gameboardService.checkAllActivitiesForChallangeStatus(challenges);
        	});

        	// FAILED
        	$scope.$on('gameboard.getGameboard.failed', function (event, data) {
        		$scope.activityGroups = null;
        	});
        }]);
}());