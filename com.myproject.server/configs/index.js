const development = require('./development');
const production = require('./production');

if (process.env.NODE_ENV === 'development') {
    module.exports = development;
} else if (process.env.NODE_ENV === 'production') {
    module.exports = production;
} else {
    module.exports = development;
}
// ToDo: Test for production and development senarios
