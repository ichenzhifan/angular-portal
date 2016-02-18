module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			js: {
				src: [
					// Angular modules, bootstrapping
					'scripts/angular/loader/angular-loader.js',
					'scripts/angular/angular.js',
					'scripts/angular/animate/angular-animate.js',
					'scripts/angular/route/angular-route.js',
					'scripts/angular/ngStorage/ngStorage.js',
					'scripts/angular/datepicker/angular-pickadate.js',
					'scripts/angular/ui-bootstrap/ui-bootstrap.js',
					'scripts/angular/ui-bootstrap/ui-bootstrap-tpls.js',
					'scripts/angular/sanitize/angular-sanitize.js',
					'scripts/angular/angular-strap/dist/angular-strap.js',
					'scripts/angular/angular-strap/dist/angular-strap.tpl.js',
					'scripts/angular/toastr/toaster.js',
					'scripts/angular/ngTagsInput/ng-tags-input.js',
					'scripts/pacejs.min.js',
					
					// Other scripts
					'scripts/lodash-underscore.js',
					'//js.pusher.com/2.2/pusher.min.js',

					// Application scripts
					'app/setup/app.js',
					'app/setup/init_modules.js',
					'app/setup/appSettings.route.js',
					'app/setup/configModel.js',
					'app/setup/directives.js',
					'app/setup/uuidFactory.js',

					'app/constants/*',
					'app/directives/*',
					'app/filters/*',
					'app/_repositories/*',
					'app/sections/**',
					'app/_services/*',
					'app/_services/common/*',

					// Ignoe
					'!app/**/*.html/',
					'!app/sections/**/*.html'
				],
				dest: 'built.js'
			}
		},
		uglify: {
			js: {
				files: {
					'built.js': ['built.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat:js', 'uglify:js']);
};