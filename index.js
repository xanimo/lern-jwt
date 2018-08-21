const config = require('./server/config/index');
const app = require('./server/index');

module.exports = app.start(config);