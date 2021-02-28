const express = require('express');
const router = express.Router();
const response = require('../services/response');
const encryption = require('../services/encryption');
const log = require('../services/logger');
const me = require('../package.json');
const initialize = require('./initialize');
const config = require('../configs');
const helmet = require('helmet');
const redisClient = require('../services/database').redis;
const limiter = require('express-limiter')(router, redisClient);
const _ = require('lodash');
const bodyParser = require('body-parser');
const cors = require('cors');
const hpp = require('hpp');
const contentLength = require('express-content-length-validator');
const url = require('url');
const fnv = require('fnv-plus');
const RequestLogs = require('../models').RequestLogs;
const Cacheman = require('cacheman');
const EngineRedis = require('cacheman-redis');
const queue = require('../services/queue');
const fileSystem = require("fs");
const shortId = require('shortid');

const MAX_CONTENT_LENGTH_ACCEPTED = config.maxContentLength * 1;

// load routes. Comes with versioning. unversioned routes should be named like 'user.js'
// versioned files or routes should be named as user.v1.js. 
// The versioned routes will be available at /v1/routename or as the route version reads
// The latest version will also be loaded on the default route /routename
router._loadRoutes = function (routeFiles) {
    let versions = [];
    let ourRoutes = {};
    // Number of routes, removing index and initialize
    let currentRoute = 0;
    let routeNum = routeFiles.length * 1;

    // Comes with endpoint versioning 
    routeFiles.forEach(function (file) {
        currentRoute = currentRoute + 1;
        let splitFileName = file.split('.');
        if (splitFileName[0] !== 'index' && splitFileName[0] !== 'initialize') {

            if (splitFileName.length === 3) {
                ourRoutes[splitFileName[0] + '.' + splitFileName[1]] = require('./' + splitFileName[0] + '.' + splitFileName[1]);
                router.use('/' + splitFileName[1], ourRoutes[splitFileName[0] + '.' + splitFileName[1]]);
                let splitVersion = splitFileName[1].split('v');
                let versionMap = {};
                versionMap[splitFileName[0]] = splitVersion[1];
                versions.push(versionMap);
            } else {
                ourRoutes[splitFileName[0]] = require('./' + splitFileName[0] + '.' + splitFileName[1]);
                router.use('/', ourRoutes[splitFileName[0]]);
            }

        }
        if (currentRoute === routeNum) {
            let finalVersions = {};
            _.forEach(versions, function (value) {
                _.forOwn(value, function (value, key) {
                    if (_.has(finalVersions, key)) {
                        finalVersions[key].push(value);
                    } else {
                        finalVersions[key] = [];
                        finalVersions[key].push(value);
                    }
                });
            });
            _.forOwn(finalVersions, function (value, key) {
                let sorted = value.sort();
                let sortedlength = sorted.length * 1;
                router.use('/', ourRoutes[key + '.v' + sortedlength]);
            });
        }
    });
    return ourRoutes;
};

router._sanitizeRequestUrl = function (req) {
    let requestUrl = url.format({
        protocol: req.protocol,
        host: req.hostname,
        pathname: req.originalUrl || req.url,
        query: req.query
    });

    return requestUrl.replace(/(password=).*?(&|$)/ig, '$1<hidden>$2');
};

router._allRequestData = function (req, res, next) {
    let requestData = {};
    req.param = function (key, defaultValue) {
        let newRequestData = _.assignIn(requestData, req.params, req.body, req.query);
        if (newRequestData[key]) {
            return newRequestData[key];
        } else if (defaultValue) {
            return defaultValue;
        } else {
            return false;
        }
    };
    next();
};

router._APICache = function (req, res, next) {
    let cache = new EngineRedis(redisClient);
    let APICache = new Cacheman(me.name, { engine: cache, ttl: config.backendCacheExpiry });
    req.cache = APICache;

    // Tell Frontend to Cache responses
    res.set({ 'Cache-Control': 'private, max-age=' + config.frontendCacheExpiry + '' });

    let key = [];
    key.push(req.url);
    key.push(req.ip);
    key.push(req.get('user-agent'));
    if (req.accountId) {
        key.push(req.accountId);
    }
    if(req.appId){
       key.push(req.appId);
    }
    req.cacheKey = key;
    // Remember to delete cache when you get a POST call
    // Only cache GET calls
    if (req.method === 'GET') {
        //  if record is not in cache, set cache else get cache
        req.cache.get(req.cacheKey)
            .then(function (resp) {
                if (!resp) {
                    // Will be set on successful response
                    next();
                } else {
                    res.ok(resp, true);
                }
            })
            .catch(function (err) {
                log.error('Failed to get cached data: ', err);
                // Don't block the call because of this failure.
                next();
            });
    } else {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PUSH' || req.method === 'PATCH' || req.method === 'DELETE') {
            req.cache.del(req.cacheKey)
                .then(function (res) { })
                .catch(function (err) {
                    log.error('Failed to delete cached data: ', err);
                    // Don't block the call because of this failure.
                }); // No delays
        }
        next();
    }
};

router.use(helmet());
router.use(cors());
router.options('*', cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.raw({ limit: '50mb' }));
router.use(bodyParser.text({ limit: '50mb' }));
router.use(bodyParser.json());
router.use(bodyParser.raw());
router.use(bodyParser.text());

// Log requests here
router.use(function (req, res, next) {
    let ipAddress = req.ip;
    req.requestId = fnv.hash(shortId.generate() + Math.floor(100000 + Math.random() * 900000) + '' + Date.now() + '' + ipAddress, 128).str();
    res.set('X-Request-Id', req.requestId);

    let reqLog = {
        RequestId: req.requestId,
        ipAddress: ipAddress,
        url: router._sanitizeRequestUrl(req),
        method: req.method,
        body: _.omit(req.body, ['password', 'cardno']),
        app: req.appId,
        user: req.accountId,
        device: req.get('user-agent'),
        createdAt: new Date()
    };

    // Dump it in the queue
    queue.create('logRequest', reqLog).save();

    // persist RequestLog entry in the background; continue immediately
    log.info(reqLog);
    next();
});

// load response handlers
router.use(response);
// Watch for encrypted requests
router.use(encryption.interpreter);
router.use(hpp());
router.use(contentLength.validateMax({ max: MAX_CONTENT_LENGTH_ACCEPTED, status: 400, message: "Stop! Maximum content length exceeded." })); // max size accepted for the content-length
// add the param function to request object
router.use(router._allRequestData);

// API Rate limiter
limiter({
    path: '*',
    method: 'all',
    lookup: ['ip'],
    total: config.rateLimit * 1,
    expire: config.rateLimitExpiry * 1,
    onRateLimited: function (req, res, next) {
        next({ message: 'Rate limit exceeded', statusCode: 429 });
    }
});

// no client side caching
if (config.noFrontendCaching === 'yes') {
    router.use(helmet.noCache());
} else {
    router.use(router._APICache);
}

router.get('/', function (req, res) {
    res.ok({ name: me.name, version: me.version });
});

// Let's Encrypt Setup
router.get(config.letsencryptSSLVerificationURL, function (req, res) {
    res.send(config.letsencryptSSLVerificationBody);
});

// Publicly available routes here, IE. routes that should work with out requiring userid, appid and developer.
router.use('/', initialize);

// Should automatically load routes Other routes here
let normalizedPath = require("path").join(__dirname, "./");
let routeFiles = fileSystem.readdirSync(normalizedPath);

router._loadRoutes(routeFiles);
// Finished loading routes

router.use(function (req, res, next) { // jshint ignore:line
    res.notFound();
});

router.use(log.errorHandler);

module.exports = router;

// ToDo: Test API versioning
// ToDo: Test rate limiting
// ToDo: Test complete route Loader test
// ToDo: Test _sanitizeRequestUrl middleware function
// ToDo: Test _allRequestData middleware function for default value scenario
// ToDo: Make Log requests testable and write unit tests for it
// ToDo: Develop the route loader into a separate node module to be publish on npm 
// ToDo: Develop all services onto separate node module to be publish on npm 