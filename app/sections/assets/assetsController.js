(function () {
	'use-strict';

	angular.module(globals.appName + globals.controllers).controller('assetsController', [
        '$scope', 'assetService', 'messageService', function ($scope, assetService, messageService) {

        	$scope.getWidth = function (asset) {
        		return asset.numberOfItems * 10;
        	};

        	// Subscriptions
        	$scope.$on('achievedAsset', function (event, groupValue) {
        		assetService.achievedAsset($scope.assets, groupValue);
        	});

        	$scope.$on('pusher.assets.added', function (event, asset) {
        		messageService.success('Wohoo!', 'Du har tjänat in en ny sten!');
        	});
        	// INIT
        	$scope.$on('assets.getAssets.done', function (event, data) {
        		$scope.assets = data;
        	});

        	// FAILED
        	$scope.$on('assets.getAssets.failed', function (event, data) {
        		$scope.assets = null;
        	});

        	assetService.getAssets();
        }]);
}());