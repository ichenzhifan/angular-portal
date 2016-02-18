(function () {
    'use strict';

    angular.module(globals.appName + globals.directives).directive('agValUrl', [
	function () {
	    /** This regex match those types of url:
         * http://www.something.com
         * http://something.com
         * https://www.something.com
         * https://something.com
         * www.something.com
         * something.com
         * something.com/home
         * something.com/other?id=i
         * etc
         */
	    var URL_REGEXP = /^(http:\/\/|https:\/\/){0,1}[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

	    return {
	        require: 'ngModel',
	        link: function (scope, elm, attrs, ctrl) {
	            ctrl.$parsers.unshift(function (viewValue) {
	                if (URL_REGEXP.test(viewValue)) {
	                    // it is valid
	                    ctrl.$setValidity('ag-val-url', true);
	                    return viewValue;
	                } else {
	                    // it is invalid
	                    // return undefined (no model update)
	                    ctrl.$setValidity('ag-val-url', false);
	                    return viewValue;
	                }
	            });
	        }
	    }
	}]);
}());