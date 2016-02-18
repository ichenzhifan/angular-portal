(function () {
	'use strict';

	angular.module(globals.appName + globals.services).factory('dateHelperService', function () {
		//#region public methods
		/*convert to Date object*/
		function toDate(str) {
			var date = null;

			if (str === null)
				return null;

			try {
				date = new Date(str);
			} catch (ex) {
				date = null;
			} finally {
				return date;
			}
		}
		/*equals method*/
		function equals(first, second) {
			if (first === null || second === null) {
				return false;
			}

			return first.getTime() === second.getTime();
		}

		/*less than*/
		function lessThan(first, second) {
			if (first === null || second === null) {
				return false;
			}

			return first.getTime() < second.getTime();
		}

		/*less than or equals*/
		function lessThanOrEquals(first, second) {
			if (first === null || second === null) {
				return false;
			}

			return first.getTime() <= second.getTime();
		}

		/*greater than*/
		function greaterThan(first, second) {
			if (first === null || second === null) {
				return false;
			}

			return first.getTime() > second.getTime();
		}

		/*greater than or equals*/
		function greaterThanOrEquals(first, second) {
			if (first === null || second === null) {
				return false;
			}

			return first.getTime() >= second.getTime();
		}

		//#endregion

		return {
			toDate: toDate,
			equals: equals,
			lessThan: lessThan,
			lessThanOrEquals: lessThanOrEquals,
			greaterThan: greaterThan,
			greaterThanOrEquals: greaterThanOrEquals
		}
	});
}());