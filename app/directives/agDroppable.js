(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('lvlDropTarget', [
        'uuid', function (uuid) {
        	return {
        		restrict: 'A',
        		scope: {
        			onDrop: '&'
        		},
        		link: function (scope, el) {
        			var id = angular.element(el).attr("id");
        			if (!id) {
        				id = uuid.new();
        				angular.element(el).attr("id", id);
        			}

        			el.bind("dragover", function (e) {
        				if (e.preventDefault) {
        					e.preventDefault(); // Necessary. Allows us to drop.
        				}

        				if (e.stopPropagation) {
        					e.stopPropagation();
        				}
        				e.dataTransfer.dropEffect = 'move';
        				return false;
        			});

        			el.bind("dragenter", function (e) {
        				if (angular.element(e.target).hasClass('droppable')) {
        					angular.element(e.target).addClass('lvl-over');
        				}
        			});

        			el.bind("dragleave", function (e) {
        				angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
        			});

        			el.bind("drop", function (e) {
        				if (e.preventDefault) {
        					e.preventDefault(); // Necessary. Allows us to drop.
        				}

        				if (e.stopPropogation) {
        					e.stopPropogation(); // Necessary. Allows us to drop.
        				}

        				var src = getDraggElement(e);
				        if (src === null) {
				        	angular.element(e.target).removeClass('lvl-over');
					        return;
				        }
        				//var dest = document.getElementById(id);

        				if (angular.element(e.target).hasClass('droppable')) {
        					scope.onDrop({ dragData: angular.fromJson(src.getAttribute('data-custom')) });
        					angular.element(e.target).removeClass('lvl-over');

        					// Fuling för att gömma popover som visas vid hover på gameboard activity när man gör drop
        					var popover = document.body.querySelector('.popover');
        					if (angular.isDefined(popover) && popover !== null) {
        						popover.remove();
        					}

        					scope.$apply();
        				}
        			});

        			scope.$on("LVL-DRAG-START", function () {
        				var el = document.getElementById(id);
        				angular.element(el).addClass("lvl-target");
        			});

        			scope.$on("LVL-DRAG-END", function () {
        				var el = document.getElementById(id);
        				angular.element(el).removeClass("lvl-target").removeClass("lvl-over");
        			});

        			function getDraggElement(e) {
        				var data = e.dataTransfer.getData("text");
        				var src = document.getElementById(data);
        				return src;
        			}
        		}
        	}
        }]);
}());