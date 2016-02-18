(function () {
	'use strict';

	angular.module(globals.appName + globals.services).factory('messageService', [
		'toaster', function (toaster) {
			function success(title, message, options) {
				return showToast('success', title, message, options);
			}

			function error(title, message, options) {
				return showToast('error', title, message, options);
			}

			function info(title, message, options) {
				return showToast('info', title, message, options);
			}

			function warning(title, message, options) {
				return showToast('warning', title, message, options);
			}

			function showToast(type, title, message, options) {
				var defaults = {
					type: type,
					title: title,
					body: message,
					bodyOutputType: 'trustedHtml'
				};

				angular.extend(defaults, options);

				return toaster.pop(defaults);
			}

			return {
				success: success, // green
				error: error, // red
				info: info, // blue
				warning: warning // orange
			}
		}]);
}());