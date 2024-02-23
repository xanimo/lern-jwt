const defaultEnvConfig = require('./default');

module.exports = {
	app: {
		title: `${defaultEnvConfig.app.title} - Test Environment`
	},
	port: process.env.PORT || 3001,
	db: {
		uri: process.env.MONGODB_URI || `mongodb://${(process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost')}/${defaultEnvConfig.app.title}-test`,
		options: {
			user: '',
			pass: '',
		},
		debug: process.env.MONGODB_DEBUG || false
	},
	appSecret: process.env.APP_SECRET || 'zv9XwtTaITx7xEpuNHSooELlD1'
};