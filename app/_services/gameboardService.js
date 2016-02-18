(function () {
	'use-strict';
	angular.module(globals.appName + globals.services).factory('gameboardService', [
        '$rootScope', 'repoService', 'dateHelperService', function ($rootScope, repoService, dateHelperService) {
        	var activityGroups = [];

        	function getGameboard() {
        		return repoService
			        .withFunction(repoService.repositories.gameboard, 'getGameboard')
			        .exec({
			        	topic: 'gameboard.getGameboard',
			        	skipBroadcast: true
			        }).then(function (response) {
			        	activityGroups = _.sortBy(response.game, function (x) { return x.value; });

			        	_.each(activityGroups, function (game) {
			        		_.each(game.activities, function (activity) {
			        			angular.extend(activity, { isPlacedInPipeline: false, groupValue: game.value, isChallenged: false });
			        		});
			        	});

			        	$rootScope.$broadcast('gameboard.getGameboard.done', activityGroups);
			        	return activityGroups;
			        });
        	};

        	function togglePipelineStatus(activityId, isPlacedInPipeline) {
        		var activity = getActivityById(activityId);
        		activity.isPlacedInPipeline = isPlacedInPipeline;
        	};

        	function toggleIsChallanged(challenge) {
        		var act = getActivityById(challenge.activity.id),
			        isChallenged = challenge.accepted !== null;

        		challenge.expiration = dateHelperService.toDate(challenge.expiration);
        		if (dateHelperService.greaterThan(new Date(), challenge.expiration)) {
        			isChallenged = false;

        			// Broadcast (emit) on rootScope only
        			$rootScope.$emit('gameboardService.challenge.expired', challenge);
        		}

        		angular.extend(act, { isChallenged: isChallenged, challenge: challenge });
        	}

        	function checkAllActivitiesForChallangeStatus(listOfChallenges) {
        		if (listOfChallenges.length === 0 || activityGroups.length === 0) {
        			return;
        		}

        		var acceptedChallenges = _.filter(listOfChallenges, function (challenge) {
        			return challenge.accepted !== null;
        		});

        		_.forEach(acceptedChallenges, function (challenge) {
        			toggleIsChallanged(challenge);
        		});
        	}

        	function activityDone(act) {
        		var activity = getActivityById(act.id);
        		var activityGroup = _.findWhere(activityGroups, { value: activity.groupValue }),
				sum,
				activities;

        		activity.userCompletions++;

        		// remove challenged ribbon on activity.
        		activity.isChallenged = false;

        		// TODO: Remove block below when implemented in API
        		//#region REMOVE FROM HERE
        		if (activity.userCompletions === 3) {
        			// Listeners: assets, leaderboard
        			$rootScope.$broadcast('achievedAsset', activity.groupValue);
        			if (activity.id === 13)
        				$rootScope.$broadcast('achievedAchievement', 5);
        		}

        		if (activity.value <= 4) {
        			// Tre i rad på första raden?
        			activities = _.filter(activityGroup.activities, function (a) { return a.value <= 4 && a.userCompletions >= activity.userCompletions; });
        			sum = _.reduce(activities, function (memo, item) { return memo + item.value; }, 0);
        			if (sum === 7) {
        				// Listeners: assets, leaderboard
        				$rootScope.$broadcast('achievedAsset', activity.groupValue);
        			}
        		} else {
        			// Tre i rad på andra raden?
        			activities = _.filter(activityGroup.activities, function (a) { return a.value > 4 && a.userCompletions >= activity.userCompletions; });
        			sum = _.reduce(activities, function (memo, item) { return memo + item.value; }, 0);
        			if (sum === 56) {
        				// Listeners: assets, leaderboard
        				$rootScope.$broadcast('achievedAsset', activity.groupValue);
        			}
        		}

        		//#endregion TO HERE
        	};

        	function droppedInGameboard(activityId, groupId) {
        		var activity = _.findWhere(_.findWhere(activityGroups, { id: groupId }).activities, { id: activityId });
        		if (!activity) {
        			$rootScope.$broadcast('LVL-DRAG-END');
        			return;
        		}
        		activity.isPlacedInPipeline = false;

        		$rootScope.$broadcast('gameboard.activity.dropped', activityId);
        		$rootScope.$broadcast('LVL-DRAG-END');
        	};

        	function checkIfInPipeline(activitiesInPipeline) {
        		_.each(activityGroups, function (activityGroup) {
        			_.each(activityGroup.activities, function (activity) {
        				_.each(activitiesInPipeline, function (inPipeline) {
        					if (activity.id === inPipeline.id) {
        						activity.isPlacedInPipeline = true;
        					}
        				});
        			});
        		});
        	};

        	function resetActivities(activityGroups, groupId) {
        	    var activityGroup = null;

                // check the params, if one of them is null, return directly.
        	    if (activityGroups == null ||
                    activityGroups.length === 0 ||
                    groupId == null)
        	        return;

                // get special group by id.
        	    _.forEach(activityGroups, function (group, index) {
        	        if (group.id === groupId)
        	            activityGroup = group;
        	    });

        	    if (activityGroup) {
                    // reset activity userCompletions to init value(0).
        	        _.forEach(activityGroup.activities, function (activity, index) {
        	            activity.userCompletions = 0;
        	        });
        	    }
        	}

        	function getActivityById(activityId) {
        		var item;
        		_.each(activityGroups, function (group) {
        			var tempItem = _.findWhere(group.activities, { id: activityId });
        			if (angular.isDefined(tempItem)) {
        				item = tempItem;
        			}
        		});

        		return item;
        	};

        	//#region Lines
        	/*Row Completion entity, contains three properties(left, middle and right) and assign default value*/
        	function RowCompletion(left, middle, right) {
        		this.left = left ? left : 0;
        		this.middle = middle ? middle : 0;
        		this.right = right ? right : 0;
        	}

        	function getUserCompletionByRow(activities, row) {
        		var rowCompletion = new RowCompletion();

        		if (row === 1 || row === 2) {
        			rowCompletion.left = _.findWhere(activities, { row: row, column: 1 }).userCompletions;
        			rowCompletion.middle = _.findWhere(activities, { row: row, column: 2 }).userCompletions;
        			rowCompletion.right = _.findWhere(activities, { row: row, column: 3 }).userCompletions;
        		}

        		return rowCompletion;
        	}

        	function oneLine(activity, activities) {
        		var rowCompletion = null;

        		if (activity.row === 1) {
        			rowCompletion = getUserCompletionByRow(activities, 1);
        			return rowCompletion.middle >= 1 && rowCompletion.left > 0 && rowCompletion.right > 0;
        		}
        		if (activity.row === 2) {
        			rowCompletion = getUserCompletionByRow(activities, 2);
        			return rowCompletion.middle >= 1 && rowCompletion.left > 0 && rowCompletion.right > 0;
        		}
        	}

        	function twoLines(activity, activities) {
        		var rowCompletion = null;

        		if (activity.row === 1) {
        			rowCompletion = getUserCompletionByRow(activities, 1);
        			return rowCompletion.middle >= 2 && rowCompletion.left >= 2 && rowCompletion.right >= 2;
        		}
        		if (activity.row === 2) {
        			rowCompletion = getUserCompletionByRow(activities, 2);
        			return rowCompletion.middle >= 2 && rowCompletion.left >= 2 && rowCompletion.right >= 2;
        		}
        	}

        	function threeLines(activity, activities) {
        		var rowCompletion = null;

        		if (activity.row === 1) {
        			rowCompletion = getUserCompletionByRow(activities, 1);
        			return rowCompletion.middle === 3 && rowCompletion.left === 3 && rowCompletion.right === 3;
        		}
        		if (activity.row === 2) {
        			rowCompletion = getUserCompletionByRow(activities, 2);
        			return rowCompletion.middle === 3 && rowCompletion.left === 3 && rowCompletion.right === 3;
        		}
        	}
        	//#endregion Lines

        	return {
        		getGameboard: getGameboard,
        		activityDone: activityDone,
        		togglePipelineStatus: togglePipelineStatus,
        		toggleIsChallanged: toggleIsChallanged,
        		checkAllActivitiesForChallangeStatus: checkAllActivitiesForChallangeStatus,
        		droppedInGameboard: droppedInGameboard,
        		checkIfInPipeline: checkIfInPipeline,
        		resetActivities: resetActivities,

        		oneLine: oneLine,
        		twoLines: twoLines,
        		threeLines: threeLines
        	}
        }]);
}());