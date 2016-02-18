(function () {
	'use strict';

	angular.module(globals.appName + globals.controllers).controller('assetNotificationController', [
		'$scope', 'accountHandler', 'messageService',
		function ($scope, accountHandler, messageService) {

			//#region Subscriptions

			//#region Assets
			$scope.$on('pusher.assets.added', function (event, data) {
                // AEP-269: top menu shows incorrect number of stones.
			    // Update the specific asset value (numberOfItems)			   
			    updateAssetValue(data.assetTypeId);
				$scope.totalNumberOfAssets++;
			});
			//#endregion Assets

			$scope.$on('accountHandler.signIn.done', function () {

			});

			$scope.$on('accountHandler.signOut.done', function () {
				resetScopeData();
			});

			//#endregion

			//#region private
			function resetScopeData() {
				$scope.stones = [];
				$scope.totalNumberOfAssets = 0;
			}

		    /*update specific asset value(numberOfItems)*/
			function updateAssetValue(groupId) {
			    _.each($scope.stones, function (asset) {
			        if (asset.activityGroupId === groupId) {
			            asset.numberOfItems++;
			        }
			    });
			}
			//#endregion

			//INIT
			$scope.$on('assets.getAssets.done', function (event, assets) {
				$scope.stones = assets;
				$scope.totalNumberOfAssets = 0;

				_.each(_.pluck($scope.stones, 'numberOfItems'), function (numberOfItems) {
					$scope.totalNumberOfAssets += numberOfItems;
				});
			});

			resetScopeData();
		}]);
}());