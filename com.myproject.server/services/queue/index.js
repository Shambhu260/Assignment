const config = require('../../configs');
const kue = require('kue');
const log = require('../../services/logger');
const Model = require('./Model');

const queue = kue.createQueue({
    redis: config.redisURL
});

// Clean Up Completed Job
queue
    .on('job enqueue', function (id, type) {
        log.info('Job %s got queued of type %s', id, type);
    })
    .on('job complete', function (id, result) {
        log.info('ID: ', id, ' Result: ', result);
        kue.Job.get(id, function (err, job) {
            if (err) {
                return false;
            } else {
                job.remove(function (err) {
                    if (err) {
                        throw err;
                    } else {
                        log.info('removed completed job #%d', job.id);
                    }
                });
            }
        });
    });

// Graceful Shutdown
process.once('SIGTERM', function (sig) {
    queue.shutdown(5000, function (err) {
        log.warn('Queue shutting down: ', err || '');
        process.exit(0);
    });
});

// Error Handling
queue.on('error', function (err) {
    log.error('Queue Error... ', err);
});

// Handle uncaughtExceptions
process.once('uncaughtException', function (err) {
    log.error('Something bad happened[uncaughtException]: ', err);
    queue.shutdown(5000, function (err2) {
        log.error('Kue shutdown due to uncaughtException: ', err2 || 'OK');
        process.exit(0);
    });
});

// Pull Jobs out of stuck state
queue.watchStuckJobs(1000);

// Process Jobs Here
module.exports = queue;
module.exports.kue = kue;
module.exports.addSchedule = function (crontab, name, job, data) {
    Model.create({ crontab: crontab, name: name, job: job, arguments: data })
        .then(function () {
            // Silence is golden
        })
        .catch(function (err) {
            log.error('Error scheduling job - ', err);
        });
};
