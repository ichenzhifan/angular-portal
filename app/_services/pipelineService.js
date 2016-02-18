(function () {
	'use-strict';

	angular.module(globals.appName + globals.services).factory('pipelineService', [
        '$rootScope', 'repoService', '$q', function ($rootScope, repoService, $q) {
        	var completedActivities = [],
				activitiesInPipeline = [{ position: 1 }, { position: 2 }, { position: 3 }];

        	function getPipeline() {
        		return repoService
					.withFunction(repoService.repositories.pipeline, 'getPipeline')
					.exec({
						topic: 'pipeline.getPipeline'
					}).then(function (data) {
						if (data.pipeline === null) {
							angular.extend(data, { pipeline: { activitiesInPipeline: [], endDate: '' } });
						}
						//activitiesInPipeline = data.pipeline.activitiesInPipeline;
						var dataActivities = data.pipeline.activitiesInPipeline;
						// Fill pipeline so it always contains 3 objects

						_.forEach(activitiesInPipeline, function (act) {
							_.forEach(dataActivities, function (dataAct) {
								if (dataAct.position === act.position) {
									activitiesInPipeline.replaceItem(act, dataAct);
								}
							});
						});

						_.forEach(activitiesInPipeline, function (act) {
							if (act.isCompleted) {
								completedActivities.push(act);
							}
						});

						return { activitiesInPipeline: activitiesInPipeline, endDate: data.pipeline.endDate };
					});
        	};

        	function addToPipeline(activities, activityId, groupId, index) {
        		var activity = _.findWhere(activities, { id: activityId });

        		// Activity in pipeline, switch places
        		if (activity.isPlacedInPipeline) {
        			var activityInPipeline = _.findWhere(activitiesInPipeline, { id: activityId }),
				        oldIndex = _.indexOf(activitiesInPipeline, activityInPipeline),
				        otherActivity = activitiesInPipeline.splice(index, 1, activityInPipeline)[0],
				        otherActivityPosition = otherActivity.position;

        			// Switch places with the current object on the new index
        			activitiesInPipeline.splice(oldIndex, 1, otherActivity);

        			otherActivity.position = activityInPipeline.position;
        			activityInPipeline.position = otherActivityPosition;

        			if (_.has(otherActivity, 'id')) {
        				repoService
							.withFunction(repoService.repositories.pipeline, 'putActivityPosition')
							.exec({
								topic: 'pipeline.putActivityPosition',
								data: { activityId: otherActivity.id, position: oldIndex + 1 }
							});
        			}

        			repoService
        			    .withFunction(repoService.repositories.pipeline, 'putActivityPosition')
        			    .exec({
        			    	topic: 'pipeline.putActivityPosition',
        			    	data: { activityId: activityId, position: index + 1 }
        			    });
        		} else {
        			// An activity from the gameboard
        			if (activitiesInPipeline[index].hasOwnProperty('id')) {
        				removeFromPipeline(activitiesInPipeline[index].id);
        			}
        			angular.extend(activity, { position: index + 1 });
        			activitiesInPipeline.splice(index, 1, activity);

        			repoService
        			    .withFunction(repoService.repositories.pipeline, 'postActivity')
        			    .exec({
        			    	topic: 'pipeline.postActivity',
        			    	data: { activityId: activityId, position: index + 1 }
        			    });

        			$rootScope.$broadcast('pipeline.activity.dropped', activityId);
        		}
        	};

        	function isFull() {
        		return _.every(activitiesInPipeline, function (item) {
        			return item.id !== undefined;
        		});
        	};

        	function isOngoing() {
        		for (var i = 0; i < completedActivities.length; i++) {
        			if (_.contains(activitiesInPipeline, completedActivities[i])) {
        				return true;
        			}
        		}
        		return false;
        	};

        	function activityDone(activity) {
        		var activityInPipeline = _.findWhere(activitiesInPipeline, { id: activity.id }),
			        tempDate = new Date();

        		if (!activityInPipeline) {
        			return $q.when(null);
        		}

        		tempDate.setDate(tempDate.getDate() + 7);
        		var endDate = new Date(tempDate);

        		activityInPipeline.isCompleted = true;
        		// Is this the first activity that's being completed?
        		if (isFull() && completedActivities.length === 0) {
        			repoService
				        .withFunction(repoService.repositories.pipeline, 'putEndDate')
				        .exec({
				        	topic: 'pipeline.putEndDate',
				        	data: { enddate: endDate }
				        });
        		}


        		completedActivities.push(activityInPipeline);

        		// TODO: Remove this logic..
        		if (_.every(activitiesInPipeline, function (item) { return item.isCompleted === true; })) {
        			// Listeners: assets, leaderboard
        			$rootScope.$broadcast('achievedAsset', 1); // Hard coded to group 1 until rules are decided for this event..

        			// Clear and reset pipeline
        			resetPipeline();
        		}

        		return $q.when(endDate);
        	};

        	function removeFromPipeline(activityId, skipBroadcast) {
        		var activityInPipeline = _.findWhere(activitiesInPipeline, { id: activityId });
        		activityInPipeline.isCompleted = false;

        		activitiesInPipeline.replaceItem(activityInPipeline, { position: activityInPipeline.position });

        		if (!skipBroadcast) {
        			$rootScope.$broadcast('pipeline.activity.removed', activityId);
        		}

        		repoService
			        .withFunction('pipelineRepository', 'deleteActivity')
			        .exec({
			        	topic: 'pipeline.deleteActivity',
			        	data: { activityId: activityId }
			        });
        	};

        	function resetPipeline() {
        		_.each(activitiesInPipeline, function (item) {
        			removeFromPipeline(item.id);
        			//activitiesInPipeline.replaceItem(item);
        		});

        		completedActivities.splice(0, completedActivities.length);
        	};

        	function pipelineTimeout() {
        		_.each(activitiesInPipeline, function (item) {
        			// Delete from list
        			var activityInPipeline = _.findWhere(activitiesInPipeline, { id: item.id });
        			activitiesInPipeline.replaceItem(activityInPipeline, { position: activityInPipeline.position });
        			//activitiesInPipeline.replaceItem(item);
        		});

        		completedActivities.splice(0, completedActivities.length);
        	}

        	function broadcastActivities() {
        		$rootScope.$broadcast('pipeline.getPipeline.done', { activitiesInPipeline: activitiesInPipeline });
        	};

        	return {
        		getPipeline: getPipeline,
        		activityDone: activityDone,
        		addToPipeline: addToPipeline,
        		removeFromPipeline: removeFromPipeline,
        		//isFullRule: isFull,
        		isOngoing: isOngoing,
        		broadcastActivities: broadcastActivities,
        		resetPipeline: resetPipeline,
        		pipelineTimeout: pipelineTimeout
        	}
        }]);
}());