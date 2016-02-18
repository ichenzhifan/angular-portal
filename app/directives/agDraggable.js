(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('lvlDraggable', [
        '$rootScope', 'uuid', function ($rootScope, uuid) {
        	return {
        		restrict: 'A',
        		link: function (scope, el, attrs) {
        			if (attrs.lvlDraggable === 'false') return;

        			angular.element(el).attr('draggable', 'true');

        			var id = angular.element(el).attr('id');
        			if (!id) {
        				id = uuid.new();
        				angular.element(el).attr('id', id);
        			}

        			el.bind('dragstart', function (e) {
        				e.dataTransfer.setData('text', id);
        				$rootScope.$broadcast('LVL-DRAG-START');
        			});

        			el.bind('dragend', function (e) {
        				$rootScope.$broadcast('LVL-DRAG-END');
        			});
        		}
        	}
        }]);
}());