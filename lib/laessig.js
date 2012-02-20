/*!
 * laessig
 *
 * Copyright(c) 2012 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */
var fs = require('fs')
  , less = require('less')
  , moment = require('moment')
  , watch = require('watch');

module.exports = (function() {
	
	var meta = {
		name: 'laessig',
		author: 'André König <andre.koenig@gmail.com>',
		version: '0.0.1'
	};

	var configuration = {
		extensions: {
			less: '.less',
			css: '.css'
		}
	};

	var helper = {
		print : function(data, error) {
			var now = moment();
			var timestamp = now.format('DD.MM.YYYY HH:mm:ss');

			var output = '[' + timestamp + '] ';

			if (error) {
				output = output + 'ERROR: ';

				if (typeof data === 'object') {
					output += 'Line ' + data.line + ' - ' + data.message;
				} else {
					
				}
			} else {
				output = output + 'INFO: ' + data;
			}

			console.log(output);
		},
		compile : function(source, options) {
			var css = source.substr(0, source.length - 5) + configuration.extensions.css;

			fs.readFile(source, 'utf8', function (error, content) {
				helper.print('Compiling "' + source + '" ...');

				var parser = new(less.Parser)({
					filename: source,
					paths: [options.directory]
				});

				parser.parse(content, function(error, tree) {
					try {
						fs.writeFile(css, tree.toCSS({
							compress: options.minify
						}), function() {
							helper.print(' ... done.');
						});
					} catch(e) {
						helper.print(e, true);
					}
				});
			});
		}
	};

	return {
		version: meta.version,

		observe : function(options) {
			var directory = options.directory;

			fs.stat(directory, function(error) {
				if (error) {
					helper.print(directory + ' is not a directory.', true);
					return;
				}

				helper.print('Observing "' + directory + '" ...');

				watch.createMonitor(directory, function (monitor) {
					// TODO: Implement an ignore list.
					var precompile = function(file) {
						if(file.substr(-5) === configuration.extensions.less) {
							helper.compile(file, options);
						}
					};

					monitor.on('created', precompile)
					monitor.on('changed', precompile);
				});	
			});
		}
	}
})();