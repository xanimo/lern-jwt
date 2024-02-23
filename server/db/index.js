const mongoose = require('mongoose');
const { data } = require('./seeds/seeder');
const User = require('./models/user');

module.exports.init = (config) => {
	mongoose.Promise = global.Promise;
	this.connect(config);
}

let lock = false;
module.exports.connect = (config) => {
	mongoose.connect(config.db.uri, config.db.options)
	.then(function(err) {
		mongoose.set('debug', config.db.debug);
		console.log('Mongoose connection successful.');		
		if (!lock) {
			for (let i = 0; i < data[0].documents.length; i++) {
				User.findOne({ email: data[0].documents[i].email })
				.then((user) => {
					if (user) {
						lock = true;
					} else {
						User.create(data[0].documents[i])
						.then((response) => {
							console.log(response);
						})
						.catch((error) => {
							console.log(error);
						})
						lock = true;
					}
				})
				.catch((error) => {
					console.log(error);
				});
			}
			
		}
	})
	.catch((err) => {
		console.error('Could not connect to MongoDB!');
		console.log(err);
	});
};

module.exports.disconnect = (cb) => {
	mongoose.disconnect(function(err) {
		console.log('Disconnected from MongoDB.');
		cb(err);
	});
};
