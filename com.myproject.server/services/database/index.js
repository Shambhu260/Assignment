const databases = {
    sysMongo: require('./sysMongo'),
    logMongo: require('./logMongo'),
    etlMongo: require('./etlMongo'),
    arcMongo: require('./arcMongo'),
    redis: require('./redis'),
    api: require('./api')
};

module.exports = databases;