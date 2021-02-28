const _ = require('lodash');

module.exports = function (req, res, next) {
    let responseTypes = {
        ok: require('./ok'),
        badRequest: require('./badRequest'),
        forbidden: require('./forbidden'),
        notFound: require('./notFound'),
        serverError: require('./serverError'),
        unauthorized: require('./unauthorized')
    };

    res = _.extend(res, responseTypes);
    next();
};
