const encryption = require('../services/encryption');
const config = require('../configs');
const debug = require('debug')('initialize');

module.exports = {
    init: function (req, res, next) {
        encryption.generateKey()
            .then(function (resp) {
                res.ok({ 'x-tag': resp });
            })
            .catch(function (err) {
                next(err);
            });
    }
};
