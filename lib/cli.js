/*!
 * laessig
 *
 * Copyright(c) 2012 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */
"use strict";

var colors = require('colors'),
    moment = require('moment');

module.exports = function () {
    var timestamp = function () {
        return '[' +  moment().format('DD.MM.YYYY HH:mm:ss') + '] ';
    };

    return {
        hello : function (message) {
            console.log(message.underline.inverse);
        },
        info : function (message) {
            console.log(timestamp() + message.green);
        },
        error : function (message) {
            console.log(timestamp() + message.red);
        }
    };
};