(function () {
    'use strict';

    angular.module(globals.appName + globals.services).factory('cachedTemplates', [
		'$templateCache', function ($templateCache) {
		    var template = function (url, html) {
		        this.html = html;
		        this.url = url;
		    };

		    var templates = [
				new template('agTypehead/ahead.tpl.html', '<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="$isVisible()" role="select"><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $index == $activeIndex}"><a role="menuitem" tabindex="-1" ng-click="$select($index, $event)"><img class="user-tag-dropdown" ng-src="{{match.value.image}}" /><span ng-bind="match.label"></span></a></li></ul>'),
				new template('popover/activityDescription.tpl.html', '<div class="popover activity-popover-small"><div class="popover-inner"><h3 class="popover-title"><strong>{{activity.name}}</strong></h3><div ng-show="activity.userCompletions > 0" class="popover-content"><ul class="list-inline"><p>Du har gjort denna aktivitet {{activity.userCompletions}} gång(er).</p></ul></div></div></div>'),
				new template('popover/challangeTimer.tpl.html', '<div class="popover activity-popover-small"><div class="popover-inner"><h3 class="popover-title"><strong>{{activity.name}}</strong></h3><div class="popover-content"><p>Tid kvar att utföra utmaningen:</p><div model="{{activity}}" date="activity.challenge.expiration" sender="gameboard" ag-countdown-clock></div></div></div></div>'),
                new template('popover/badgeDescription.tpl.html', '<div class="popover activity-popover-small"><div class="popover-inner"><h3 class="popover-title"><strong>{{badge.name}}</strong></h3><div class="popover-content"><div><p ng-show="badge.completed != null">{{badge.completed | date : format: "short"}}</p><p ng-show="badge.completed == null">{{badge.percentageDone | formatPercentage}}</p></div></div></div></div>'),
                new template('popover/pipelineInfo.tpl.html', '<div class="popover activity-popover-small"><div class="popover-inner"><h3 class="popover-title"><strong>Pipeline</strong></h3><div class="popover-content"><p>Pipelinen finns för att organisationen skall veta vad som planeras. Pipelinen är ögat som blickar framåt. När du fyllt din pipeline med tre aktiviteter och påbörjar en någon av aktiviteterna så låser den sig. När du utfört alla aktiviteter i pipelinen så töms den och du erhåller en extra sten för ditt åtagande.<br /></p></div></div></div>'),
                new template('popover/gameboardInfo.tpl.html', '<div class="popover activity-popover-small"><div class="popover-inner"><h3 class="popover-title"><strong>Pipeline</strong></h3><div class="popover-content"><p>The max number of dots under activity is 3 even if completed more than 3 times. <br /></p></div></div></div>')
		    ];

		    function init() {
		        _.forEach(templates, function (tmpl) {
		            $templateCache.put(tmpl.url, tmpl.html);
		        });
		    };

		    return {
		        init: init
		    }
		}
    ]);
}());