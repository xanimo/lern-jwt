const defaultEnvConfig = require('./default');

module.exports = {
	app: {
		title: `${defaultEnvConfig.app.title} - Test Environment`
	},
	port: process.env.PORT || 3001,
	appSecret: process.env.APP_SECRET || 'zv9XwtTaITx7xEpuNHSooELlD1'
};