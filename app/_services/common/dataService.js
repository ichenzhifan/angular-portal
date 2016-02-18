(function () {
    'use strict';

    angular.module(globals.appName + globals.services).factory('dataService', [
        '$timeout', '$http', 'configModel', '$window', 'messageService', '$exceptionHandler', 'urlService',
		function ($timeout, $http, configModel, $window, messageService, $exceptionHandler, urlService) {
		    function post(url, data, options) {
		        return $http.post(configModel.baseUrl + url, data, options).success(function (response) {
		            return response;
		        }).error(function (response) {
		            messageService.error('Ett fel uppstod', parseErrors(response));

		            return parseErrors(response);
		        });
		    }

		    function get(url, data, options) {
		        return getExternal(configModel.baseUrl + url + getQueryParams(data), options);
		    }

		    function getLocal(url) {
		        return $http.get(configModel.localUrl + url);
		    }

		    function getExternal(url, options) {
		        if (angular.isDefined(options) && options.paceIgnore) {
                    // add url path name to pace ignoreUrls list.
		            $window.Pace.addIgnoreUrl(urlService.parser(url).pathName);
		            return $http.get(url);
		        }
               
		        return $http.get(url);
		    }

		    function put(url, data) {
		        return $http.put(configModel.baseUrl + url, data).success(function (response) {
		            return response;
		        }).error(function (response) {
		            messageService.error('Ett fel uppstod', parseErrors(response));

		            return parseErrors(response);
		        });
		    }

		    function del(url, data) {
		        return $http.delete(configModel.baseUrl + url + getQueryParams(data)).success(function (response) {
		            return response;
		        }).error(function (response, status) {
		            return status + ': ' + response.Message;
		        });
		    }

		    //#region "Private functions"
		    function getQueryParams(data) {
		        if (data === null || typeof (data) === "undefined")
		            return '';

		        if (!angular.isObject(data)) {
		            $exceptionHandler('Data must be object for dataService to be able to parse as query parameters. You passed in: ', data);
		            return;
		        }

		        var queryParams = '?';
		        _.each(_.keys(data), function (key) {
		            queryParams += key + '=' + data[key] + '&';
		        });
		        queryParams = queryParams.substring(0, queryParams.length - 1);

		        return queryParams;
		    }

		    function parseErrors(errorObject) {
		        var errors = errorObject.errors,
					msg = null;

		        _.forEach(errors, function (error) {
		            msg += '<strong>' + error.field + '</strong> : ' + error.message + '<br />';
		        });
		        return msg ? msg : '<strong>Ingen feldata tillgänglig.</strong>';
		    }

		    //#endregion

		    return {
		        post: post,
		        get: get,
		        put: put,
		        delete: del,

		        getLocal: getLocal,
		        getExternal: getExternal
		    };
		}
    ]);
}());