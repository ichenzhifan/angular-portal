(function () {
	'use-strict';

	angular.module(globals.appName + globals.controllers).controller('pipelineController', [
        '$scope', 'modalService', 'pipelineService', 'activityService', function ($scope, modalService, pipelineService, activityService) {
        	var activities = [];

        	$scope.dropped = function (index, data) {
        		pipelineService.addToPipeline(activities, data.activityId, data.groupId, index);
        	};

        	//$scope.isFull = function () {
        	//	return pipelineService.isFullRule();
        	//};

        	$scope.isOngoing = function () {
        		return pipelineService.isOngoing();
        	};

        	$scope.buildCustomData = function (activityId) {
        		return angular.toJson({ activityId: activityId });
        	};

        	$scope.open = function (activity) {
        		//activityService.openActivityModal(activity);
        		activityService.openActivityModal(activity).then(function (modalResult) {
        			if (!modalResult)
        				return;

        			pipelineService.activityDone(activity).then(function (response) {
        				if (response !== null) {
        					$scope.endDate = response;
        				}
        			});
        		});
        	};

        	$scope.removeFromPipeline = function (activityId) {
        		pipelineService.removeFromPipeline(activityId);
        	};

        	$scope.resetPipeline = function () {
        		var modalOptions = {
        			headerText: 'Rensa pipeline',
        			content: 'Om Du låser upp och rensar din pipeline så kommer Du går miste om möjligheten att få en extra sten efter att alla tre aktiveter är genomförda. Är Du säker på att du vill göra det?',
        			imgSrc: '/Content/images/icon/warning.png',
        			closeButtonText: 'Nej',
        			actionButtonText: 'Ja',
        			showFooter: true
        		};

        		modalService.showModal({}, modalOptions).then(function (modalResult) {
        			if (modalResult) {
        				pipelineService.resetPipeline();
        			}
        		});
        	};

        	// Subscriptions
        	//$scope.$on('activity.done', function (event, activity) {
        	//	pipelineService.activityDone(activity).then(function (response) {
        	//        if (response !== null) {
        	//        	$scope.endDate = response;
        	//        }
        	//	});
        	//});

        	$scope.$on('gameboard.activity.dropped', function (event, activityId) {
        		pipelineService.removeFromPipeline(activityId, true);
        	});

        	$scope.$on('pipeline.countDown.finished', function (event, data) {
        		if ($scope.isOngoing()) {
        			pipelineService.pipelineTimeout();
        		}
        	});

        	// INIT
        	$scope.$on('gameboard.getGameboard.done', function (event, activityGroups) {
        		pipelineService.broadcastActivities();
        		_.each(activityGroups, function (game) {
        			_.each(game.activities, function (activity) {
        				activities.push(activity);
        			});
        		});
        	});

        	pipelineService.getPipeline().then(function (data) {
        		$scope.activitiesInPipeline = data.activitiesInPipeline;

        		$scope.endDate = data.endDate ? data.endDate : null;
        	});
        }]);
}());