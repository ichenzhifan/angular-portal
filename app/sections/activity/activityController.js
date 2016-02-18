(function () {
	'use-strict';
	angular.module(globals.appName + globals.controllers).controller('activityController', [
       '$scope', 'activityService', function ($scope, activityService) {
       	var self = this;

       	self.addToPipeline = activityService.addToPipeline;       
       	return self;
       }]);
}());