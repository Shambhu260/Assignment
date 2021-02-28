const db = require('../database').logMongo;
const collection = 'APICalls';
const debug = require('debug')(collection);

const schemaObject = {
    RequestId: { type: 'String', unique: true },
    uri: { type: 'String' },
    method: { type: 'String' },
    service: { type: 'String' },
    data: { type: db._mongoose.Schema.Types.Mixed },
    headers: { type: db._mongoose.Schema.Types.Mixed },
    response: { type: db._mongoose.Schema.Types.Mixed },
    responseStatusCode: { type: 'Number' }
};

schemaObject.createdAt = {
    type: 'Date',
    default: Date.now
};

schemaObject.updatedAt = {
    type: 'Date'
    // default: Date.now
};

schemaObject.retriedAt = {
    type: 'Date'
    // default: Date.now
};

const Schema = new db._mongoose.Schema(schemaObject);

const Model = db.model(collection, Schema);

module.exports = Model;
