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

//
// DOCME
//
function Watcher(options) {
    // options:
    //     file - The observable file
    //     extensions
    //         less - The less file extension.
    //
    events.EventEmitter.call(this);

    var that = this,
        observable = options.file,
        directory = path.dirname(observable) + '/',
        createSnapshot = function () {
            var config = {
                directory: directory,
                extension: options.extensions.less
            },
                changedFiles;

            if (that.snapshot) {

                // Create a new snapshot
                snapshooter.create.from(config).then(function (snapshot) {
                    if (!snapshooter.has(snapshot).file(observable)) {
                        var error = {
                            message: 'Oh oh - The observable file ' + observable + ' is not available.'
                        };
                        that.emit('error', error);
                    }

                    // Check if the current snapshot is newer than the old one.
                    // The helper method will return the changed file if there is a change.
                    changedFiles = snapshooter.is(snapshot).newerThan(that.snapshot);

                    if (changedFiles.length !== 0) {
                        that.emit('change', changedFiles);

                        that.snapshot.forEach(function (entry) {
                            fs.unwatchFile(directory + entry.filename);
                        });

                        that.snapshot = snapshot;

                        // NEW SNAPSHOT
                        // Watch all new files.
                        that.snapshot.forEach(function (entry) {
                            fs.watch(directory + entry.filename, {persistent: false}, function (event) {
                                createSnapshot();
                            });
                        });
                    }
                });
            }
        };

    that.snapshot = [];

    // Observe the directory
    fs.watch(directory, function (event) {
        createSnapshot();
    });

    // Create the first snapshot.
    createSnapshot();
}

Watcher.super_ = events.EventEmitter;

Watcher.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Watcher,
        enumerable: false
    }
});

module.exports = Watcher;