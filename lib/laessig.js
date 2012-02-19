/*!
 * laessig
 *
 * Copyright(c) 2012 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */
var fs = require('fs')
    watch = require('watch');

module.exports = (function() {
	
	var meta = {
		name: 'laessig',
		author: 'André König <andre.koenig@gmail.com>',
		version: '0.0.1'
	};

	var configuration = {
		extensions: {
			less: '.less'
			css: '.css'
		}
	};

	var helper = {
		print : function(message) {
			console.log(meta.name + '> ' + message);
		},
		compile : function(source) {
			var css = source.substr(0, source.length - 5) + configuration.extensions.css;
		}
	};

	return {
		version: meta.version,

		observe : function(options) {
			var directory = options.directory;

			fs.stat(directory, function(error) {
				if (error) {
					console.log(directory + ' is not a directory.');
					return;
				}

				helper.print('Observing "' + directory + '" ...');

				watch.createMonitor(directory, function (monitor) {
					// TODO: Implement an ignore list.
					var precompile = function(file) {
						if(file.substr(-5) === configuration.extensions.less) {
							helper.compile();
						}
					};

					monitor.on('created', precompile)
					monitor.on('changed', precompile);
				});	
			});
		}
	}
})();