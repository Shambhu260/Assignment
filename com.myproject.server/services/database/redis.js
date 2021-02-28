const redis = require('redis');
const config = require('../../configs');
const log = require('../../services/logger');

const client = redis.createClient(config.redisURL);

client.on("error", log.error);

client.on("connect", function () {
    log.info('Redis database connection successful');
});

module.exports = client;

//const _redis = require("redis");
//const { promisify } = require("util");
//const { redisConfig } = require("../configs");
//const { host, port, password } = redisConfig;
//const redis = _redis.createClient({ host, port, password });
//const getAsync = promisify(redis.get).bind(redis);
//redis.on('connect', () => {
//    console.error("Redis      OKAY");
//});
//redis.on("error", (err) => {
//    console.error("Redis Connection Error", err);
//});
//module.exports.redis = redis;
//module.exports.redisGetAsync = getAsync;