(function () {
	'use strict';

	var app = angular.module(globals.appName + globals.constants);
	app.constant('routes', getSecureRoutes());

	function getSecureRoutes() {
		return [
	    {
	    	url: '/home',
	    	config: {
	    		templateUrl: 'app/sections/shell/shell.html',
	    		title: 'Home'
	    	}
	    },
		{
			url: '/signin',
			config: {
				templateUrl: 'app/sections/account/signIn.html',
				title: 'Sign in'
			}
		},
        {
        	url: '/activityfeed',
        	config: {
        		templateUrl: 'app/sections/activityfeed/activityfeed.html',
        		title: 'Activityfeed',
        		settings: {
        			allowAnonymous: false
        		}
        	}
        },
		{
			url: '/currentUserProfile',
			config: {
				templateUrl: 'app/sections/userprofile/currentUserProfile.html',
				title: 'Your profile',
				settings: {
					allowAnonymous: false
				}
			}
		},
		{
			url: '/userProfile/:userId',
			config: {
				templateUrl: 'app/sections/userprofile/userProfile.html',
				title: 'User profile',
				settings: {
					allowAnonymous: false
				}
			}
		},
        {
            url: '/currentUserBadge',
            config: {
                templateUrl: 'app/sections/achievements/achievementDetails.html',
                title: 'User badge',
                settings: {
                    allowAnonymous: false
                }
            }
        }
		];
	};

	app.config(['$routeProvider', 'routes', '$locationProvider', function ($routeProvider, routes, $locationProvider) {
		routes.forEach(function (r) {
			$routeProvider.when(r.url, r.config);
		});

		$routeProvider.otherwise({ redirectTo: '/home' });
	}]);
}());