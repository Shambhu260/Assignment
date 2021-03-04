const database = require('../services/database/sysMongo');
const { Schema } = require('mongoose');
const collection = 'user';
const debug = require('debug')(collection);
const mongoose = require('mongoose');

const schema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        default: "kumar",
        required: true,
    },
    email: {
        type: String,
        default: "sh@gmail.com",
        required: true,
    },
    phone: {
        type: String,
        default: "",
        required: true,
    },
    profileImg: {
        type: String,
        default: "",
        required: true,
    },
}, {
    timestamps: true
});
module.exports = database.model("user", schema);