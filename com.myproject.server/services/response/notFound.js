const log = require('../logger');
const _ = require('lodash');
const queue = require('../queue');

module.exports = function () {
    log.warn('Sending 404 response: ' + 'not found');
    let req = this.req;
    let res = this;

    // Dump it in the queue
    let response = { response: { status: 'error', message: 'not found' } };
    response.requestId = req.requestId;

    queue.create('logResponse', response).save();

    this.status(404).json({ status: 'error', message: 'not found' });
};
