(function () {
	'use strict';

	angular.module(globals.appName + globals.filters).filter('formatUrl', function () {
			return function (url) {
				if (!url) {
					return null;
				}

				var formattedUrl = url;
				if (url.indexOf('http') === -1) {
					if (url.indexOf('www') === -1) {
						formattedUrl = 'http://www.' + url;
					} else {
						formattedUrl = 'http://' + url;
					}
				}

				return formattedUrl;
			}
		});
}());