const mongoose = require('mongoose');
const config = require('../../configs');
const log = require('../../services/logger');

const mongoConfig = {};
mongoConfig.config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
mongoConfig.Url = config.logMongoURL;

if (config.env === 'production') {
    mongoConfig.config.autoIndex = false;
} else {
    mongoose.set('debug', true);
}

mongoose.set('useCreateIndex', true);
mongoose.Promise = require('q').Promise;

// Initialize our database
mongoose.connect(mongoConfig.Url, mongoConfig.config).catch((e) => {
    log.error('mongoose log error ', e.message);
});

const database = mongoose.connection;
database.on('error', () => (
    setTimeout(() => {
        log.error('MONGO LOG CONNECTION FAILED => trying again ', mongoConfig.Url);
        try {
            mongoose.connect(mongoConfig.Url, mongoConfig.config).catch((e) => {
                log.error('mongoose log error ', e.message);
            });
        } catch (e) {
            log.error('MONGO LOG CONNECTION e  ', e.message);
        }
    }, 5000)
));

database.once('open', () => {
    log.info('logMongoDB database connection successful');
    log.info(mongoConfig.Url);
    mongoose.connection.on('connected', () => {
        log.info('logMongoDB event connected');
    });

    mongoose.connection.on('disconnected', () => {
        log.error('logMongoDB event disconnected');
    });

    mongoose.connection.on('reconnected', () => {
        log.info('logMongoDB event reconnected');
    });

    mongoose.connection.on('error', (err) => {
        log.error('logMongoDB event error: ' + err);
    });
});

module.exports = database;
module.exports._mongoose = mongoose;
