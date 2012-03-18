/*!
 * laessig
 *
 * Copyright(c) 2012 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */
"use strict";

var events      = require('events'),
    fs          = require('fs'),
    path        = require('path'),
    snapshooter = require('./snapshooter')();

module.exports = LessWatcher;

LessWatcher.super_ = events.EventEmitter;

LessWatcher.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: LessWatcher,
        enumerable: false
    }
});

//
// DOCME
//
function LessWatcher(options) {
	var that = this;

	// options:
	//     file - The observable file
	//     extensions
	//         less - The less file extension.
	//
	events.EventEmitter.call(this);

	var observable = options.file;
	var directory = path.dirname(observable) + '/';

	var snapshotconfig = {
		directory: directory,
		extensions: options.extensions.less
	};

	that.snapshot = [];

	snapshooter.create.from(snapshotconfig).then(function (snapshot) {
		that.snapshot = snapshot;
	});

	fs.watch(directory, function (event) {
		snapshooter.create.from(snapshotconfig)
		    .then(function (snapshot) {
		    	if (!snapshooter.has(snapshot).file(observable)) {
		    		var error = {
		    			message: 'Oh oh - The observable file ' + observable + ' is not available anymore'
		    		}
		    		that.emit('error', error);
		    	}

		    	// Check if the current snapshot is newer than the old one.
		    	// The helper method will return the changed file if there is a change.
		    	var changedFiles = snapshooter.is(snapshot).newerThan(that.snapshot);

		    	if (changedFiles.length !== 0) {
		    		that.snapshot = snapshot;

console.log(that.snapshot);

		    		that.emit('change', changedFiles);
		    	}
		    });
	});
};