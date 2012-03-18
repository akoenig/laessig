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
    md5sum   = require('./md5sum'),
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
						var stats = fs.statSync(options.directory + file);

						var entry = {
							filename: file,
							md5: md5sum(options.directory + file) 
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
				deleted: 'deleted',
				modified: 'modified',
				renamed: 'renamed'
			};

			return {
				newerThan : function (oldSnapshot) {
					var changed = [];

					// Check if the item count differs between the old and
					// the new snapshot. If there are fewer items in the new
					// snapshop, we have to deal with removed files.
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
								// TODO: Use Object.create(entry)
								var changedEntry = JSON.parse(JSON.stringify(oldEntry));
								changedEntry.action = actions.deleted;
								changed.push(changedEntry);
							}
						});

					// If there are more entries in the new snapshot, then
					// we have to deal with added files.
					} else if (snapshot.length > oldSnapshot.length) {
						snapshot.forEach(function (entry) {
							var found = false;

							oldSnapshot.forEach(function (oldEntry) {
								if (entry.filename === oldEntry.filename) {
									found = true;

									return;
								}
							});

							if (!found) {
								// TODO: Use Object.create(entry)
								var changedEntry = JSON.parse(JSON.stringify(entry));
								changedEntry.action = actions.added;

								changed.push(changedEntry);
							}
						});

					// Means that we have to deal with renamed files.
					// So check which file is newer.
					} else if (snapshot.length === oldSnapshot.length) {
						snapshot.forEach(function (entry) {
							oldSnapshot.forEach(function (oldEntry) {
								if ( (entry.filename !== oldEntry.filename) &&
									 (entry.md5 === oldEntry.md5) ) {

									// TODO: Use Object.create(entry)
									var changedEntry = JSON.parse(JSON.stringify(entry));
									changedEntry.action = actions.renamed;

									changed.push(changedEntry);

								} else if ( (entry.filename === oldEntry.filename) &&
									 (entry.md5 !== oldEntry.md5) ) {

									// TODO: Use Object.create(entry)
									var changedEntry = JSON.parse(JSON.stringify(entry));
									changedEntry.action = actions.modified;

									changed.push(changedEntry);

								}
							});
						});
					}

					return changed;
				}
			}
		}
	}
};