(function () {
	'use strict';

	angular.module(globals.appName + globals.directives)

	.directive('agUserProfileImageUpload', [
		'toaster', 'configModel', 'uploadFileService', 'messageService', function (toaster, configModel, uploadFileService, messageService) {
			return {
				restrict: 'E',
				replace: 'true',
				scope: {
					defaultSrc: "@"
				},
				templateUrl: '/app/directives/templates/agUserProfileImageUpload.html',
				link: function (scope, ele, attrs) {
					var validFileTypes = [
				        'png',
				        'jpg',
				        'jpeg'
					];

					// launch a dialog to select image.
					scope.onClickImage = function () {
						var file = ele.find('input')[0];
						file && file.click();
					};

					// image preview and upload image.
					scope.onSelectedFile = function ($files) {
						var file = getValidImage($files),
		                    targetElement = ele.find('img')[0];

						if (!file && !targetElement)
							return;

						previewFile(file, angular.element(targetElement));
						// Upload the image
						uploadFileService.uploadUserProfileImage(file);
					};

					//#region Private functions
					function previewFile(file, target) {
						var reader = null;
						if (file === null)
							return;

						reader = new FileReader();
						reader.onload = function (e) {
							target.attr('src', e.target.result);
						}
						reader.readAsDataURL(file);
					}

					function getValidImage(files) {
						var file = null,
                            fileSize = 0;

						if (files === null || files.length === 0)
							return null;

						file = files[0];
						if (!_.contains(validFileTypes, file.type.substr(6))) {
							messageService.error('Fel filtyp.', 'Filtypen bör vara någon av följande: <strong>' + _.values(validFileTypes) + '.</strong>');
							return null;
						}

						// convert to kb.
						fileSize = (file.size / 1024).toFixed(0);

						if (fileSize < configModel.userImageSize.min ||
                            fileSize > configModel.userImageSize.max) {
							messageService.error('Filen har fel storlek.', 'Max storlek på filen är ' + configModel.userImageSize.max + ' kb');
							file = null;
						}

						return file;
					};
					//#endregion
				}
			};
		}]);
}());