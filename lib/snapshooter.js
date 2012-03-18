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
		},
		is : function (snapshot) {
			var actions = {
				added: 'added',
				deleted: 'deleted'
			};

			return {
				newerThan : function (oldSnapshot) {
					var changed = [];

					// Check if the item count differs between the old and
					// the new snapshot. If there a fewer items in the new
					// snapshop, we have to deale with removed files.
					if (snapshot.length < oldSnapshot.length) {
						oldSnapshot.forEach(function (oldEntry) {
							var alive = false;
							
							snapshot.forEach(function (entry) {
								if (oldEntry.filename === entry.filename) {
									alive = true;

									return;
								}
							});

							if (!alive) {
								oldEntry.action = actions.deleted;
								changed.push(oldEntry);
							}
						});
					// If there are more entries in the new snapshot, then
					// we have to deal with added files.
					} else if (snapshot.length > oldSnapshot.length) {

					// Means that we have to deal with renamed files.
					} else if (snapshot.length === oldSnapshot.length) {

					}

					return changed;
				}
			}
		}
	}
};