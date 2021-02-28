const util = require('util');
const debug = require('debug')('validator');
const _ = require('lodash');

module.exports = function (req, res, next) {
    debug('starting validation check.');
    debug('What we got: ', req.body);
    let parameters = req._required;
    let ignores = req._ignored;
    if (parameters.length) {
        var last = parameters.length - 1;
        for (var n in parameters) {
            if (parameters[n]) {
                debug('validating ' + parameters[n]);
                req.check(parameters[n], parameters[n] + ' is required').notEmpty();
                if (_.indexOf(parameters[n]) > -1) { /* jshint ignore:line */
                    // Skip
                } else {
                    req.sanitize(parameters[n]).escape();
                    req.sanitize(parameters[n]).trim();
                }

                if (n * 1 === last) {
                    debug("parameters: ", parameters[n]);
                    debug('validation over, lets take it home...');
                    var errors = req.validationErrors();
                    if (errors) {
                        res.badRequest(util.inspect(errors), 'Validation error.');
                    } else {
                        next();
                    }
                }
            }
        }
    } else {
        next();
    }
};
