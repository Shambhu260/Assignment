const winston = require('winston');
const config = require('../../configs');
const response = require('../response');
const winstonMongoDb = require('winston-mongodb');
const winstonLoggly = require('winston-loggly-bulk');
//const logDb = require('../database/logMongo');

const log = winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple(),
        winston.format.json()
    )
});

log.add(new winston.transports.Console());

if (config.logTo === 'File') {
    log.add(new winston.transports.File({ filename: 'app-' + new Date().toDateString().split(' ').join('_') + '.log', level: 'verbose' }));
}

if (config.logTo === 'Loggly' && config.logglyToken) {
    log.add(new winston.transports.Loggly({ token: config.logglyToken, subdomain: config.logglySubdomain, tags: [config.logglyTag], json: true, level: 'warn' }));
}

if (config.logTo === 'DB') {
    log.add(new winston.transports.MongoDB({ db: 'parcel-guru-log', collection: 'logger', level: 'warn', capped: true }));
}

//log.remove(winston.transports.Console);

module.exports = log;
module.exports.errorHandler = function (err, req, res, next) { // jshint ignore:line
    response(req, res, next);
    log.error(err);
    if (err.statusCode === 404) {
        res.notFound(err);
    } else if (err.statusCode === 401) {
        res.unauthorized(err);
    } else if (err.statusCode === 400) {
        res.badRequest(err);
    } else if (err.statusCode === 503) {
        res.forbidden(err);
    } else {
        res.serverError(err);
    }
};
// ToDo: Test Error Handler
