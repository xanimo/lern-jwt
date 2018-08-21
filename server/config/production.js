const defaultEnvConfig = require('./default'),
	  path = require('path');

module.exports = {
	app: {
		title: `${defaultEnvConfig.app.title}`
	},	
	secure: {
		ssl: true,
		// privateKey: path.join(__dirname, './sslcerts/privkey.pem'),
		// certificate: path.join(__dirname, './sslcerts/fullchain.pem')
	},
	port: process.env.PORT || 8443,
	tokenTimeout: 3600,
	db: {
		uri: process.env.MONGODB_URI || `mongodb://${(process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost')}/${defaultEnvConfig.app.title}`,
		options: {
			user: '',
			pass: '',
			useNewUrlParser: true
		},  
		debug: process.env.MONGODB_DEBUG || false
	},
	appSecret: process.env.APP_SECRET || 'zv9XwtTaITx7xEpuNHSooELlD1'
};