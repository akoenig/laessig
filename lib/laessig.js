/*!
 * laessig
 *
 * Copyright(c) 2012 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */
"use strict";

var cli = require('./cli')(),
    fs = require('fs'),
    less = require('less'),
    path = require('path'),
    Watcher = require('./watcher');

module.exports = (function () {

    var meta = {
        name: 'laessig',
        author: 'André König <andre.koenig@gmail.com>',
        version: '0.2.0'
    },
        configuration = {
            extensions: {
                less: '.less',
                css: '.css'
            }
        },
        helper = {
            compile : function (source, options) {
                var css = source.replace(path.extname(source), configuration.extensions.css);

                fs.readFile(source, 'utf8', function (error, content) {
                    cli.info('COMPILING: ' + source + ' -> ' + css);

                    var parser = new (less.Parser)({
                        filename: source,
                        paths: [options.directory]
                    });

                    parser.parse(content, function (error, tree) {
                        try {
                            fs.writeFile(css, tree.toCSS({
                                compress: options.minify
                            }), function () {
                                cli.info('COMPILING: successful!');
                            });
                        } catch (e) {
                            cli.error('COMPILE ERROR: ' + e.filename + ' - ' + e.message);
                        }
                    });
                });
            }
        };

    return {
        version: meta.version,

        observe : function (options) {
            cli.hello(meta.name + ' (v' + meta.version + '): ' + "observe ...");

            if (path.extname(options.file) !== configuration.extensions.less) {
                cli.error('Ouch - The observable file ' + options.file + ' is not a LESS file.');
            } else {
                var minify = options.minify,
                    observable = options.file,
                    watcher = new Watcher({
                        file: observable,
                        extensions: configuration.extensions
                    });

                watcher.on('change', function (changedFiles) {
                    changedFiles.forEach(function (entry) {
                        cli.info(entry.action.toUpperCase() + ': ' + entry.filename);
                    });

                    helper.compile(observable, {
                        minify: minify
                    });
                });

                watcher.on('error', function (error) {
                    cli.error(error.message);

                    process.exit(1);
                });
            }
        }
    };
}());