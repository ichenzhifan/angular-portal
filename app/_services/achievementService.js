(function () {
	'use-strict';
	angular.module(globals.appName + '.services').factory('achievementService', [
          'repoService', '$rootScope', 'paths', function (repoService, $rootScope, paths) {
          	//#region public methods
          	function getAllBadges() {
          		repoService
					.withFunction(repoService.repositories.achievements, 'getAllBadges')
					.exec({
						topic: 'achievement.getAllBadges',
						skipBroadcast: true
					}).then(function (badges) {
						_.forEach(badges, function (badge) {
							badge.imageSrc = badge.imageSrc ? badge.imageSrc : paths.defaultBadge;
							badge.description = badge.description ? badge.description : 'Default badge description';
							badge.name = badge.name ? badge.name : 'Default badge name';
						});

						badges = _.chain(badges).sortBy('completed').reverse().sortBy('percentageDone').reverse().value();

						$rootScope.$broadcast('achievement.getAllBadges.done', getVisibleBadges(badges));
					});
          	};
          	//#endregion

          	//#region private helper methods
          	function getVisibleBadges(badges) {
          		if (badges === null || badges.length === 0)
          			return [];

          		// get completed badges and visible badges.
          		return badges.filter(function (badge) {
          			return badge.isVisible;
          		});
          	}

          	//#endregion
          	return {
          		getAllBadges: getAllBadges
          	}
          }
	]);
}());