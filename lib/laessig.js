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
    LessObserver = require('./lessobserver');

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
            return path.extname(filename) === configuration.extensions.less;
        }
    };

    return {
        version: meta.version,

        observe : function (options) {
            var minify = options.minify,
                file = options.file;

            var lessObserver = new LessObserver({
                file: file,
                extensions: configuration.extensions
            });

            lessObserver.on('changed', function (lessFile) {

            });

            lessObserver.on('error', function (error) {
                console.log("OHHHH NO!!!");
                console.log(error);

                process.exit(1);
            });
        }
    };
}());