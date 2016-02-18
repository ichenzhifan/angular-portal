(function () {
	'use strict';

	angular.module(globals.appName + globals.filters).filter('formatNumber', function () {
		return function (n) {
			if (!_.isNumber(n))
				return n;

			if (n < 10) {
				return '0' + n;
			} else {
				return n;
			}
		}
	});
}());