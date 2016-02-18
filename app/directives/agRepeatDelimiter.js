(function() {
	'use strict';

	angular.module(globals.appName + globals.directives)
	// Add a delimiter to the end of the list items. This is
	// designed to be used in conjunction with ngRepeat. It will
	// add the delimiter to all list items; but it will only show
	// on all but the $last ngRepeat item.
	.directive("agRepeatDelimiter", function () {
		// Return the directive configuration. Notice that
		// our priority is 1 higher than ngRepeat - this will
		// be compiled before the ngRepeat compiles.
		return {
			priority: 1001,
			restirct: "A",
			compile: function (element, attributes) {
				// Compile the list, injecting in the conditionally
				// visible delimiter onto the end of the template.

				// Get the delimiter that goes between each item.
				var delimiter = (attributes.agRepeatDelimiter || ",");

				// The delimiter will show on all BUT the last
				// item in the list.
				var delimiterHtml = (
                    "<span ng-show=' ! $last '>" +
                        delimiter +
                        "</span>"
                );

				// Add the delimiter to the end of the list item,
				// making sure to add the existing whitespace back
				// in after the delimiter.
				var html = element.html().replace(
                    /(\s*$)/i,
                    function (whitespace) {
                    	return (delimiterHtml + ' ');
                    }
                );
				// Update the compiled HTML.
				element.html(html);
			}
		};
	});

}());