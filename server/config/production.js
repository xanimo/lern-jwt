const defaultEnvConfig = require('./default'),
	  path = require('path');

module.exports = {
	app: {
		title: `${defaultEnvConfig.app.title}`
	},	
	secure: {
		ssl: true,
		privateKey: path.join(__dirname, './sslcerts/server.key'),
		certificate: path.join(__dirname, './sslcerts/server.crt')
	},
	port: process.env.PORT || 3001,
	tokenTimeout: 3600,
	db: {
		uri: process.env.MONGODB_URI,
		options: {
			user: encodeURIComponent('user'),
			pass: encodeURIComponent(process.env.MONGODB_PASSWORD),
			ssl: true,
			tlsInsecure: true,
			authSource: 'users',
			authMechanism: 'SCRAM-SHA-256',
			tlsCAFile: path.join(__dirname, './sslcerts/rootCA.pem'),
			// tlsCertificateKeyFile: path.join(__dirname, './sslcerts/mongodb.pem'),
		},
		debug: process.env.MONGODB_DEBUG || false
	},
	appSecret: process.env.APP_SECRET || 'zv9XwtTaITx7xEpuNHSooELlD1'
};
