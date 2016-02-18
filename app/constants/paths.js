(function () {
	'use strict';

	angular.module(globals.appName + globals.constants).constant('paths', {
	    defaultImage: '/Content/images/icon/default_user.png',
	    defaultBadge: '/Content/images/trophies/Checklista.png',
	    badgeIcons: {
	        checklista: "/Content/images/trophies/Checklista.png",
	        diamant: "/Content/images/trophies/Diamant.png",
	        gladmun: "/Content/images/trophies/Glad-mun.png",
	        myra: "/Content/images/trophies/Myra.png",
	        ros: "/Content/images/trophies/Ros.png",
	        tarta: "/Content/images/trophies/Tarta.png"
	    }
	});
}());