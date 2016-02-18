(function () {
	'use strict';

	angular.module(globals.appName + globals.services).factory('assetService', [
		'$rootScope', 'repoService', function ($rootScope, repoService) {

            //#region public methods
			function getAssets() {
				return repoService
					.withFunction(repoService.repositories.assets, 'getAssets')
					.exec({
						topic: 'assets.getAssets',
						skipBroadcast: true
					}).then(function (result) {
						var groups = _.sortBy(result.achievedAssets, function (x) { return x.activityGroupValue; }),
							assets = [];

						_.each(groups, function (group) {
							assets.push({
								activityGroupId: group.activityGroupId,
								activityGroupValue: group.activityGroupValue,
								name: group.activityGroupName,
								numberOfItems: group.numberOfItems,
								items: getStones(group.numberOfItems, group.imageSrc),
								img: group.imageSrc
							});
						});

						$rootScope.$broadcast('assets.getAssets.done', assets);
						return assets;
					});
			};

			function achievedAsset(assets, activityGroupValue) {
				var asset = _.findWhere(assets, { activityGroupValue: activityGroupValue });
				asset.numberOfItems++;
				asset.items.push({
					image: asset.img
				});
			};
		    //#endregion

            //#region private methods
			function getStones(noOfStones, imagePath) {
				var tempList = [];
				for (var i = 0; i < noOfStones; i++) {
					tempList.push({
						image: imagePath
					});
				}

				return tempList;
			};
            //#endregion

			return {
				getAssets: getAssets,
				achievedAsset: achievedAsset
			}
		}]);
}());