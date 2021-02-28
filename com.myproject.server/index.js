const cluster = require('cluster');
const config = require('./configs');
const log = require('./services/logger');
const basicAuth = require('basic-auth-connect');
const express = require('express');
const jwt = require('express-jwt');

if (cluster.isMaster && config.env === 'production') {
    let kue = require('./services/queue').kue;
    let app = express();
    app.use(basicAuth(config.queueUIUsername, config.queueUIPassword));
    app.use(kue.app);
    let server = app.listen(config.queueUIPort, function () {
        let host = server.address().address;
        let port = server.address().port;
        log.info('Queue UI listening on host ' + host + ', port ' + port + '!');
    });

    // Count the machine's CPUs
    let cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker,
        // we're not sentimental
        log.info('Worker %d died', worker.id);
        cluster.fork();
    });
} else {
    let app = express();
    let router = require('./routes');
    let express_enforces_ssl = require('express-enforces-ssl');

    if (config.trustProxy === 'yes') {
        app.enable('trust proxy');
    }

    if (config.enforceSSL === 'yes') {
        app.use(express_enforces_ssl());
    }

    app.use(jwt({
        secret: config.jwtKey,
        credentialsRequired: false,
        getToken: function fromHeaderOrQuerystring(req) {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                return req.headers.authorization.split(' ')[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        }
    }).unless({
        path: [
            '/api/v1/user/login'
        ]
    }));

    app.use('/api', router);

    if (config.env === 'production') {
        log.info('Worker %d running!', cluster.worker.id);
    }

    const _web_folder = '../client/web';

    app.use("/assets", express.static('../client/assets'));
    app.use("/web", express.static(_web_folder));
    app.use("/support", express.static('../client/support'));
    app.use("/", express.static('../client/site'));

    //Serve Application Paths
    app.all('*', function (req, res) {
        res.status(200).sendFile(`/`, { root: _web_folder });
    });

    let server = app.listen(config.port, function () {
        let host = server.address().address;
        let port = server.address().port;
        log.info('API server listening on host ' + host + ', port ' + port + '!');
    });
}
