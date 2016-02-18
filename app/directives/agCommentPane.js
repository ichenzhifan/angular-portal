(function () {
	'use strict';

	angular.module(globals.appName + globals.directives)

	.directive('agCommentPane', [function () {
			return {
				restrict: 'E',
				replace: 'true',
				scope: {
				    isVisible: "=",
				    newsData: "=",
				    image: "@",
				    userName: "@",                    			    
                    onEnter:"&"
				},
				templateUrl: '/app/directives/templates/agCommentPane.html',
				link: function (scope, ele, attrs) {
				    scope.obj = {
				        isPosting: false,
				        message: ''
				    };

				    scope.onSubmit = function (news, obj) {                        
				        if (news.obj.message == "" || news.obj.message == null) {
				            return;
				        }

				        if (scope.onEnter) {
				            scope.onEnter(news, obj);
				        }
				        scope.obj.message = "";
				        scope.isVisible = false;
				    };

                    // set focus on input control if the pane is shown.
				    scope.$watch("isVisible", function (newValue) {
				        if (newValue) {
				            ele.find("input")[0].focus();				           
				        }
				    });
				}
			};
		}]);
}());