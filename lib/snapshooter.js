/*!
 * laessig
 *
 * Copyright(c) 2012 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */
"use strict";

var deferred = require('deferred'),
    fs       = require('fs'),
    path     = require('path'),
    _        = require('underscore');

module.exports = function () {
	return {
		create : {
			from : function (options) {
				var future = deferred();

				// options:
				//     directory
				//     extension - The filter extension

				fs.readdir(options.directory, function (error, files) {
					var snapshot = [];

					// Remove all files from the array which does NOT
					// have the less file extension.
					files = _.reject(files, function (filename) {
						return !path.extname(filename, options.extension);
					});

					files.forEach(function (file) {
						var entry = {
							filename: file,
							mtime: fs.statSync(options.directory + file).mtime
						};

						snapshot.push(entry);
					});

					future.resolve(snapshot);
				});

				return future.promise();
			}
		},
		has : function (snapshot) {
			return {
				file : function (filename) {
					var file = _.filter(snapshot, function (entry) {
						return entry.filename === filename;
					});

					return (file.length > 0);
				}
			}
		}		
	}
};