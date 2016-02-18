(function () {
    'use strict';

    angular.module(globals.appName + globals.directives).directive('agScrollTo', ["$rootScope", function ($rootScope) {
        return {
            restrict: "A", // attribute
            scope: {
                scrollEle: "@", // scroll element id with.
                scrollTo: "@",  // scroll to element id.     
                scrollDuration: "@", // animation duration
                scrollTopic: "@"  // broadcast topic, by default: "scroll.done"
            },
            link: function (scope, element, attrs) {
                element.bind("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();

                    animatedScrollTo(
                       document.getElementById(scope.scrollEle),
                       document.getElementById(scope.scrollTo).offsetTop,
                       scope.scrollDuration ? new Number(scope.scrollDuration) : 100,
                       function () {
                           $rootScope.$broadcast(scope.scrollTopic ? scope.scrollTopic : "scroll.done", { message: "scroll.done" });
                       });
                });
            }
        };
    }]);
}());