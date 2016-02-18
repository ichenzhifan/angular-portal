(function () {
	'use strict';

	angular.module(globals.appName + globals.filters).filter('formatPercentage', function () {
		return function (n) {
			if (n == null || !_.isNumber(n))
				return '0%';

			return n + '%';
		}
	});
}());