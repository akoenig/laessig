/*!
 * laessig
 *
 * Copyright(c) 2012 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */
"use strict";

var deferred = require('deferred'),
    events   = require('events'),
    fs       = require('fs'),
    path     = require('path'),
    _        = require('underscore');

module.exports = LessObserver;

LessObserver.super_ = events.EventEmitter;

LessObserver.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: LessObserver,
        enumerable: false
    }
});

//
// DOCME
//
function LessObserver(options) {
	console.log(options);
	// options:
	//     file - The observable file
	//     extensions
	//         less - The less file extension.
	//
	events.EventEmitter.call(this);

	var directory = path.dirname(options.file) + '/';

	this.snapshot = [];

	this.helper = {
		//
		// DOCME
		//
		snapshot : {
			create : function () {
				var future = deferred();

				fs.readdir(directory, function (error, files) {
					var snapshot = [];

					// Remove all files from the array which does NOT
					// have the less file extension.
					files = _.reject(files, function (filename) {
						console.log(filename);
						return !path.extname(filename, options.extensions.less);
					});

					files.forEach(function (file) {
						var entry = {
							filename: file,
							mtime: fs.statSync(directory + file).mtime
						};

						snapshot.push(entry);
					});

					future.resolve(snapshot);
				});

				return future.promise();				
			},
			has : {
				file : function (snapshot, filename) {
					var file = _.filter(snapshot, function (entry) {
						return entry.name === filename;
					});

					return (file.length > 0);
				}
			}
		}
	};

	setTimeout(function () {

	}, 2000);
};

//
// DOCME
//
LessObserver.prototype.getObservedFiles = function () {
	return this.lessFiles;
};