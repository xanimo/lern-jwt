const defaultEnvConfig = require('./default'),
	  path = require('path');

module.exports = {
	app: {
		title: `${defaultEnvConfig.app.title} - Development Environment`
	},	
	secure: {
		ssl: true,
		privateKey: path.join(__dirname, './sslcerts/server.key'),
		certificate: path.join(__dirname, './sslcerts/server.crt')
	},
	port: process.env.PORT || 8443,
	tokenTimeout: 3600,
	appSecret: process.env.APP_SECRET || 'zv9XwtTaITx7xEpuNHSooELlD1'
};