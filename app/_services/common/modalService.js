(function () {
    'use-strict';

    var modalModule = angular.module(globals.appName + globals.services);

    modalModule.service('modalService', [
        '$rootScope', '$modal', '$q', function ($rootScope, $modal, $q) {
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '/app/partials/modal_default.html'
            };

            var modalOptions = {
                showFooter: false,
                closeButtonText: 'Stäng',
                actionButtonText: 'OK',
                headerText: '',
                bodyText: ''
            };

            this.showModal = function (customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};

                return this.show(customModalDefaults, customModalOptions);
            };

            this.show = function (customModalDefaults, customModalOptions) {
            	$rootScope.$broadcast('modal.is.visible', true);

                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults, modalOptions, customModalOptions);

                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $modalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                        	$modalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                        	$modalInstance.dismiss(false);
                        };
                    }
                }

                return $modal.open(tempModalDefaults).result.then(function (response) {
                	$rootScope.$broadcast('modal.is.visible', false);
	                return response;
                }, function(response) {
                	$rootScope.$broadcast('modal.is.visible', false);
                	return false;
                });
            };
        }
    ]);
}());