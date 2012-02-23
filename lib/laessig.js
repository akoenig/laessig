/*!
 * laessig
 *
 * Copyright(c) 2012 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */
"use strict";

var fs = require('fs'),
    less = require('less'),
    moment = require('moment'),
    path = require('path'),
    watch = require('watch');

module.exports = (function () {

    var meta = {
        name: 'laessig',
        author: 'André König <andre.koenig@gmail.com>',
        version: '0.1.0'
    },
        configuration = {
            extensions: {
                less: '.less',
                css: '.css'
            }
        },
        helper = {
            print : function (data, error) {
                var now = moment(),
                    timestamp = now.format('DD.MM.YYYY HH:mm:ss'),
                    output = '[' + timestamp + '] ';

                if (error) {
                    output = output + 'ERROR: ';

                    if (typeof data === 'object') {
                        output += 'Line ' + data.line + ' - ' + data.message;
                    } else {
                        output += data;
                    }
                } else {
                    output = output + 'INFO: ' + data;
                }

                console.log(output);
            },
            compile : function (source, options) {
                var css = source.substr(0, source.length - 5) + configuration.extensions.css;

                fs.readFile(source, 'utf8', function (error, content) {
                    helper.print('Compiling "' + source + '" ...');

                    var parser = new (less.Parser)({
                        filename: source,
                        paths: [options.directory]
                    });

                    parser.parse(content, function (error, tree) {
                        try {
                            fs.writeFile(css, tree.toCSS({
                                compress: options.minify
                            }), function () {
                                helper.print(' ... done.');
                            });
                        } catch (e) {
                            helper.print(e, true);
                        }
                    });
                });
            },
            isLessFile : function (filename) {
                return (filename.substr(-5) === configuration.extensions.less);
            }
        };

    return {
        version: meta.version,

        observe : function (options) {
            var observable = options.file;

            fs.stat(observable, function (error) {
                if (error) {
                    helper.print('File does not exist ...', true);
                    return;
                } else if (!helper.isLessFile(observable)) {
                    helper.print(observable + ' is not a LESS file.', true);
                    return;
                }

                helper.print('Observing "' + observable + '" ...');

                watch.createMonitor(options.directory, function (monitor) {
                    // TODO: Implement an ignore list.
                    var precompile = function (file) {
                        if (helper.isLessFile(file)) {
                            helper.print('Modified "' + file + '". Compiling ...');
                            helper.compile(observable, options);
                        }
                    };

                    monitor.on('created', precompile);
                    monitor.on('changed', precompile);
                });
            });
        }
    };
}());