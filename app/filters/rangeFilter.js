(function () {
    'use strict';

    angular.module(globals.appName + globals.filters).filter('range', function () {
        return function (input, total, max) {
            if (max == null) {
                max = total;
            }
            // items count in range should less than or equals max value.
            total = parseInt(total < max ? total : max);
            for (var i = 0; i < total; i++)
                input.push(i);
            return input;
        };
    });
}());