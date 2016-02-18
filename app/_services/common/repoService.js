(function () {
	'use strict';

	/*
	 * Options can contain:
	 * 
	 * topic: <string>			- A message to be broadcasted using $rootScope.$broadcast
	 * skipBroadcast: <boolean> - If the broadcast should be skipped or not
	 * data: <object>			- Data object with arguments to send in post/put request
	 * 
	 */

	angular.module(globals.appName + globals.services).factory('repoService', [
		'$rootScope',
		'configModel',
		'$injector',
		'$exceptionHandler',
		'$q',
		function ($rootScope,
			configModel,
			$injector,
			$exceptionHandler,
			$q) {
			var self = {};

			self.repositories = {
				gameboard: 'gameboardRepository',
				assets: 'assetRepository',
				activity: 'activityRepository',
				achievements: 'achievementRepository',
				leaderboard: 'leaderboardRepository',
				activityFeed: 'activityFeedRepository',
				pipeline: 'pipelineRepository',
				user: 'userRepository',
				challenge: 'challengeRepository',
				notification: 'notificationRepository'
		};

			self.withFunction = function (repositoryName, functionName) {
				var repo = $injector.get(repositoryName);

				if (!repo) {
					$exceptionHandler(repositoryName + " doesn't seem to be found. Did you spell it correct or is it injected to repoService?", repositoryName);
				}

				if (!repo[functionName]) {
					$exceptionHandler(functionName + ' in repository ' + repositoryName + " can't be found. Did you spell it correct?", "Functions in " + repositoryName + ' : ' + _.functions(self[repositoryName]));
				}

				self.repoFunc = repo[functionName];

				return self;
			};

			self.exec = function (options) {
				log(options.topic + ' started');

				var deferred = $q.defer();

				// TODO: Add authorization control here before fetching any data.
				self.repoFunc(options.data).then(function (data) {
					log(options.topic + '.done', data);

					if (!options.skipBroadcast) {
						$rootScope.$broadcast(options.topic + '.done', data);
					}

					deferred.resolve(data);
				}, function (reason) {
					log(options.topic + '.failed', reason, true);

					// Always broadcast when fail
					$rootScope.$broadcast(options.topic + '.failed', reason);

					deferred.reject(reason);
				});

				return deferred.promise;
			};

			var log = function (message, data, override) {
			    if (configModel.debug || override) {
			        if (data) {
			            console.log(message, data);
			        } else {
			            console.log(message);
			        }				
				}
			};

			return self;
		}]);
}());