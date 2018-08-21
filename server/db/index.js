const mongoose = require('mongoose');

module.exports.init = (config) => {
	mongoose.Promise = global.Promise;
	this.connect(config);
}

module.exports.connect = (config) => {
	mongoose.connect(config.db.uri, config.db.options, function(err) {
		if (err) {
			console.error('Could not connect to MongoDB!');
			console.log(err);
		} else {
			mongoose.set('debug', config.db.debug);
			console.log('Mongoose connection successful.');
		}
	});
};

module.exports.disconnect = (cb) => {
	mongoose.disconnect(function(err) {
		console.log('Disconnected from MongoDB.');
		cb(err);
	});
};