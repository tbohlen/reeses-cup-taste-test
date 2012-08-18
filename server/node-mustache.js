/********************************************************************\
Project: node-mustache
File: node-mustache.js
Description: mustache helper for nodejs and expressjs
Author: Turner Bohlen (www.turnerbohlen.com)
Created: 08/17/2012
Copyright 2012 Turner Bohlen
\********************************************************************/

var mustache = require('./mustache.js')

module.exports = {
    compile: function (source, options) {
        if (typeof source == 'string') {
            return function(options) {
                options.locals = options.locals || {};
                options.partials = options.partials || {};
                if (options.body) { // for express.js > v1.0
                    locals.body = options.body;
                }
                return mustache.render(
                    source, options.locals, options.partials);
            };
        } else {
            return source;
        }
    },
    render: function (template, options) {
        template = this.compile(template, options);
        return template(options);
    }
};
