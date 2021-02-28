const log = require('../logger');
const _ = require('lodash');
const queue = require('../queue');

module.exports = function (data, message) {
    log.warn('Sending forbidden response: ', data, message || 'forbidden');
    let req = this.req;
    let res = this;

    // Dump it in the queue
    let response = { response: { status: 'error', data: data, message: message ? message : 'forbidden' } };
    response.requestId = req.requestId;

    queue.create('logResponse', response).save();

    if (data !== undefined && data !== null) {
        if (Object.keys(data).length === 0 && JSON.stringify(data) === JSON.stringify({})) {
            data = data.toString();
        }
    }

    if (data) {
        this.status(403).json({ status: 'error', data: data, message: message ? message : 'forbidden' });
    } else {
        this.status(403).json({ status: 'error', message: message ? message : 'forbidden' });
    }
};
