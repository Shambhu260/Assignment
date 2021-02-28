const models = {};
const normalizedPath = require("path").join(__dirname, "./");

require("fs").readdirSync(normalizedPath).forEach((file) => {
    let splitFileName = file.split('.');
    if (splitFileName[0] !== 'index') {
        models[splitFileName[0]] = require("./" + splitFileName[0]);
    }
});

module.exports = models;
// Todo: Automatically generate tests with the schema structure
// Add the option of elasticsearch for API search
