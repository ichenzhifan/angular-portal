(function () {
    'use strict';

    angular.module(globals.appName + globals.directives).directive('agScrollHandler', [
		'$rootScope', '$parse', function ($rootScope, $parse) {
		    return {
		        restrict: 'A', // Attribute directive
		        scope: {
		            // '@': one-way binding
		            onBottomTopic: '@',
		            onTopTopic: '@',
		            preventOnTop: '@',
		            preventOnBottom: '@'
		        },
		        link: function (scope, element, attr) {
		            var expr = $parse(attr['agScrollHandler']),
                        fn = function (event, delta, deltaX, deltaY) {
                            scope.$apply(function () {
                                expr(scope, {
                                    $event: event,
                                    $delta: delta,
                                    $deltaX: deltaX,
                                    $deltaY: deltaY
                                });
                            });
                        },
                        hamster,
                        lastScrollPos;

		            // don't create multiple Hamster instances per element
		            if (!(hamster = element.data('hamster'))) {
		                hamster = Hamster(element[0]);
		                element.data('hamster', hamster);
		            }

		            // bind Hamster wheel event
		            hamster.wheel(preventPageScroll);

		            // unbind Hamster wheel event
		            scope.$on('$destroy', function () {
		                hamster.unwheel(fn);
		            });

		            function preventPageScroll($event, $delta) {
		                var scrollTop = element[0].scrollTop,
							scrollHeight = element[0].scrollHeight,
							offsetHeight = element[0].offsetHeight,
							scrollPos = scrollHeight - offsetHeight,
							data = {
							    element: element,
							    event: $event,
							    scrollTop: scrollTop,
							    scrollHeight: scrollHeight,
							    offsetHeight: offsetHeight,
							    scrollPos: scrollPos
							};

		                // scroll down.
		                if ($delta < 0 && scrollTop === scrollPos) {
		                    // prevent scroll by default, but user can set false to keep scroll.
		                    if (scope.preventOnBottom != false && scope.preventOnBottom != "false") {
		                        $event.preventDefault();
		                    }

		                    // send broadcast about hit bottom.
		                    if (lastScrollPos !== scrollPos) {
		                        $rootScope.$broadcast(scope.onBottomTopic ? scope.onBottomTopic : 'scroll.hitbottom', data);
		                        lastScrollPos = scrollPos;
		                    }		                    
		                }

		                // scroll up
		                if ($delta > 0 && scrollTop === 0) {
		                    lastScrollPos = scrollPos;

		                    // prevent scroll by default, but user can set false to keep scroll.
		                    if (scope.preventOnTop != false && scope.preventOnTop != "false") {
		                        $event.preventDefault();
		                    }

		                    // send broadcast about hit top.		                    
		                    if (lastScrollPos !== scrollPos) {
		                        $rootScope.$broadcast(scope.onTopTopic ? scope.onTopTopic : 'scroll.hittop', data);
		                        lastScrollPos = scrollPos;
		                    }
		                }
		            }
		        }
		    }
		}
    ]);
}());