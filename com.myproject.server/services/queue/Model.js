const db = require('../database').logMongo;
const collection = 'Clock';
const debug = require('debug')(collection);

const schemaObject = {
    job: {
        type: 'String'
    },
    crontab: {
        type: 'String'
    },
    name: {
        type: 'String',
        unique: true
    },
    enabled: {
        type: 'Boolean',
        default: true
    },
    arguments: {
        type: db._mongoose.Schema.Types.Mixed
    },
    lastRunAt: {
        type: db._mongoose.Schema.Types.Mixed
    }
};

schemaObject.createdAt = {
    type: 'Date',
    default: Date.now
};

schemaObject.updatedAt = {
    type: 'Date'
        // default: Date.now
};

const Schema = new db._mongoose.Schema(schemaObject);

const Model = db.model(collection, Schema);

module.exports = Model;