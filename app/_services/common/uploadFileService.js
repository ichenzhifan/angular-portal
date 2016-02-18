(function () {
    'use strict';

    angular.module(globals.appName + globals.services).factory('uploadFileService', [
        '$rootScope', '$upload', 'configModel', 'messageService', function ($rootScope, $upload, configModel, messageService) {
            function uploadUserProfileImage(file) {
                return $upload.upload({
                    url: configModel.baseUrl + '/' + configModel.getUrl().user + "/images",
                    file: file
                }).success(function (data, status, headers, config) {
                    $rootScope.$broadcast('userProfile.imageUpload.done', data);

                    return {
                        name: data.image,
                        status: status,
                        message: data
                    };
                }).error(function (err) {
	                messageService.error('Ett fel uppstod', err);
                    return err;
                });
            };

            return {
                uploadUserProfileImage: uploadUserProfileImage
            }
        }
    ]);
}());