(function () {
    'use strict';

    angular.module(globals.appName + globals.services).factory('urlService', function () {

        /*Class: Url entity*/
        function UrlEntity(options) {
            this.protocol = options ? options.protocol : "";
            this.hostName = options ? options.hostname : "";
            this.port = options ? options.port : "";
            this.pathName = options ? options.pathname : "";
            this.search = options ? options.search : "";
            this.hash = options ? options.hash : "";
            this.host = options ? options.host : "";
        }

        function parser(url) {
            var ele = document.createElement("a");
            ele.href = url;

            return new UrlEntity(ele);
        }

        return {
            parser: parser
        }
    });
}());