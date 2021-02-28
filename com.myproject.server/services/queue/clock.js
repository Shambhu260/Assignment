const CronJob = require('cron').CronJob;
const log = require('../logger');
const Model = require('./Model');
const queue = require('./');
const _ = require('lodash');
const config = require('../../configs');

log.info('Starting Queue Clock...');
Model.find({ enabled: true })
    .then(function (jobs) {
        _.forEach(jobs, function (job) {
            log.info('Initializing ' + job.name + '...');
            let cron = new CronJob({
                cronTime: job.crontab,
                onTick: function () {
                    // run this
                    // Check if job is enabled
                    Model.findOne({ _id: job._id, enabled: true })
                        .then(function (resp) {
                            if (!resp) {
                                throw { notEnabled: true };
                            } else {
                                log.info('Pushing ' + job.name + ' to queue...');
                                queue.create(job.job, job.arguments)
                                    .save();
                            }
                        })
                        .catch(function (err) {
                            if (err.notEnabled) {
                                log.info(job.name + ' is not enabled. Skipping...');
                            } else {
                                log.error('An error occured while running Job - ' + job.name, err);
                            }
                        });

                },
                start: true,
                timeZone: config.clockTimezone
            });
        });
    })
    .catch(function (err) {
        log.error('An error occured while starting the queue clock: ', err);
    });
