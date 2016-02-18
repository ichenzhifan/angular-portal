(function () {
	'use strict';

	angular.module(globals.appName + globals.directives).directive('agCountdownClock', [
		'$window', '$rootScope', 'dateHelperService', function ($window, $rootScope, dateHelperService) {
			return {
				restrict: 'A', // Attribute directive
				scope: {
					date: '=', // attribute date="someValue" is "scope.date" in directive and two-way binding with parent scope due to =
					sender: '@', // one-way binding
					model: '@' // one-way binding
				},
				link: function (scope, element) {
					var endDate = scope.date,
						now = new Date(),
						expiration = dateHelperService.toDate(endDate),
						days,
						hours,
						minutes,
						seconds;

					// If user logged in after the end date for the pipeline has passed, clear the pipeline.
					if (dateHelperService.greaterThan(now, expiration)) {
						timeOut();
						return;
					}

					scope.$watch('date', function (newDate) {
						endDate = new Date(Date.parse(newDate));
						expiration = dateHelperService.toDate(endDate),
						now = new Date();

						if (!newDate) return;

						var msDiff = Date.DateDiff('ms', now, endDate),
						diffDate = new Date(msDiff);

						days = Date.DateDiff('d', now, endDate);
						hours = Date.DateDiff('h', now, endDate) - (days * 24);
						minutes = diffDate.getUTCMinutes();
						seconds = diffDate.getUTCSeconds();

						// If user logged in after the end date for the pipeline has passed, clear the pipeline.
						if (dateHelperService.greaterThan(now, expiration)) {
							timeOut();
							return;
						}
						//if (days < 0 || (days === 0 && hours <= 0) || (days === 0 && hours <= 0 && minutes <= 0 && seconds <= 0)) {
						//	timeOut();
						//	return;
						//}

						if (hours <= 0) {
							days--;
							hours = 24 + (hours === 0 ? -1 : hours);
						}
						if (minutes <= 0) {
							hours--;
							minutes = 60 + (minutes === 0 ? -1 : minutes);
						}
						if (seconds <= 0) {
							minutes--;
							seconds = 60 + (seconds === 0 ? -1 : seconds);
						}

						element.text(days + ':' +
							(hours < 10 ? '0' + hours : hours) + ':' +
							(minutes < 10 ? '0' + minutes : minutes) + ':' +
							(seconds < 10 ? '0' + seconds : seconds));
					});

					// Set the count down interval, counting down towards "endDate"
					var intervalId = $window.setInterval(function () {
						if (seconds >= 1) {
							seconds--;
						}

						if (minutes >= 1 && seconds === 0) {
							minutes--;
						}
						if (hours >= 1 && minutes === 0 && seconds === 0) {
							hours--;
						}
						if (days > 0 && hours === 0 && minutes === 0 && seconds === 0) {
							days--;
						}

						if (seconds === 0 && minutes > 0) {
							seconds = 59;
						}
						if (minutes === 0 && hours > 0) {
							minutes = 59;
						}
						if (hours === 0 && days > 0) {
							hours = 23;
						}

						if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
							timeOut();
							stopInterval();
						}

						element.text(days + ':' +
									(hours < 10 ? '0' + hours : hours) + ':' +
									(minutes < 10 ? '0' + minutes : minutes) + ':' +
									(seconds < 10 ? '0' + seconds : seconds));

					}, 1000);

					element.on('$destroy', function () {
						stopInterval();
					});

					function stopInterval() {
						$window.clearInterval(intervalId);
					};

					function timeOut() {
						var topic = scope.sender ? scope.sender : 'countDown';
						$rootScope.$broadcast(topic + '.countDown.finished', scope.model);
					};
				}
			}
		}
	]);
}());