(function () {
    'use strict';

    angular.module(globals.appName + globals.directives).directive('agAnchorSmoothScroll', ['$window', '$timeout',
	function ($window, $timeout) {
	    return {
	        restrict: 'E', // Element directive
	        scope: {
	            scopeToId: '@'
	        },
	        templateUrl: '/app/directives/templates/agAnchorSmoothScroll.html',
	        link: function (scope, element, attrs) {

	            scope.scrollTo = function () {

	                angular.element(document.getElementById("feedContainer")).scrollTo(0, document.getElementById(scope.scopeToId).offsetTop);

	                //$window.scrollTo(0, document.getElementById(scope.scopeToId).offsetTop);

	                //var startY = getCurrentYPosition(),
                    //    stopY = getElmYPosition(scope.scopeToId),
                    //    distance = stopY > startY ? stopY - startY : startY - stopY,
                    //    speed = Math.round(distance / 100),
                    //    step = Math.round(distance / 25),
                    //    leapY = stopY > startY ? startY + step : startY - step,
                    //    timer = 0;

	                //if (distance < 100) {
	                //    scrollTo(0, stopY);
	                //    return;
	                //}

	                //if (speed >= 20) {
	                //    speed = 20;
	                //}

	                //if (stopY > startY) {
	                //    for (var i = startY; i < stopY; i += step) {
	                //        (function (y) {
	                //            $timeout(function () {
	                //                $window.scrollTo(0, y);
	                //            }, timer * speed);
	                //        })(leapY);

	                //        leapY += step;

	                //        if (leapY > stopY) {
	                //            leapY = stopY; timer++;
	                //        }
	                //    }
	                //    return;
	                //}
	                //for (var i = startY; i > stopY; i -= step) {
	                //    (function (y) {
	                //        $timeout(function () {
	                //            $window.scrollTo(0, y);
	                //        }, timer * speed);
	                //    })(leapY);

	                //    leapY -= step;
	                //    if (leapY < stopY) {
	                //        leapY = stopY; timer++;
	                //    }
	                //}
	            };

	            //#region private methods
	            //function getCurrentYPosition() {
	            //    // Firefox, Chrome, Opera, Safari
	            //    if (self.pageYOffset) {
	            //        return self.pageYOffset;
	            //    }

	            //    // Internet Explorer 6 - standards mode
	            //    if (document.documentElement && document.documentElement.scrollTop) {
	            //        return document.documentElement.scrollTop;
	            //    }
	            //    // Internet Explorer 6, 7 and 8                    
	            //    if (document.body.scrollTop) {
	            //        return document.body.scrollTop;
	            //    }
	            //    return 0;
	            //}

	            //function getElmYPosition(eID) {
	            //    var elm = document.getElementById(eID),
                //        y = elm.offsetTop,
                //        node = elm;

	            //    while (node.offsetParent && node.offsetParent != document.body) {
	            //        node = node.offsetParent;
	            //        y += node.offsetTop;
	            //    }
	            //    return y;
	            //}
	            //#endregion
	        }
	    }
	}]);
}());