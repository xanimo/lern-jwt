const _ = require('lodash'),
	  chalk = require('chalk'),
	  glob = require('glob'),
	  fs = require('fs'),
	  path = require('path');

require('dotenv').load();

const validateEnvironmentVariable = () => {
	const environmentFiles = glob.sync(`./server/config/${process.env.NODE_ENV}.js`);
	if (!environmentFiles.length) {
		if (process.env.NODE_ENV) {
			console.error(chalk.red(` + Error: No configuration file found for "${process.env.NODE_ENV}" environment using development instead`));
		} else {
			console.warn(chalk.green(' + Warning: NODE_ENV is not defined!  Using default development environment'));
		}
		process.env.NODE_ENV = 'development';
	}
	console.log(chalk.white(''));
};

const validateSecureMode = config => {
	if (!config.secure || config.secure.ssl !== true) {
		return true;
	}
	const privateKey = fs.existsSync(path.resolve(config.secure.privateKey)),
		  certificate = fs.existsSync(path.resolve(config.secure.certificate));

	if (!privateKey || !certificate) {
		console.log(chalk.red(' + Error: Certificate file or key file is missing, falling back to non-SSL mode'));
		console.log(chalk.red(` To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh`));
		config.secure.ssl = false;
	}
};

const validateSecret = config => {
	if (config.appSecret === 'zv9XwtTaITx7xEpuNHSooELlD1') {
		console.log(chalk.red(` + WARNING: It is strongly recommended that you change appSecret config while running in production!`));
		console.log(chalk.red(' Please add `appSecret: process.env.APP_SECRET || \'super amasing secret\'` to '));
		console.log(chalk.red(' `conig/production.js` or `config/local.js`'));
		return false;
	};
	return true;
};

const initGlobalConfig = () => {
	validateEnvironmentVariable();
	const defaultConfig = require(path.join(process.cwd(), 'server/config/default')),
		  environmentConfig = require(path.join(process.cwd(), 'server/config/', process.env.NODE_ENV)) || {};

	let config = _.merge(defaultConfig, environmentConfig);
	if (process.env.NODE_ENV !== 'test') {
		config = _.merge(config, (fs.existsSync(path.join(process.cwd(), 'server/config/local.js')) &&
			require(path.join(process.cwd(), 'server/config/local.js'))) || {});
	};
	validateSecureMode(config);
	validateSecret(config);
	return config;
};

module.exports = initGlobalConfig();