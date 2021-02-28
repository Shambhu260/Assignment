const createUser = require('./create');
const searchUser = require("./get");
const getOne = require("./getOne");
const updateUser = require("./update");
const deleteUser = require('./deleteUser');

module.exports = {
    createUser,
    searchUser,
    getOne,
    updateUser,
    deleteUser,

};