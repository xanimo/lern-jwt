const User = require('../db/models/user'),
	  errorHandler = require('../db/error_handler'),
	  signJwt = require('../utils/auth').signJwt;

module.exports = {
	list: (req, res) => {
		User.find().sort('name').exec((err, users) => {
			if (err) {
				return res.status(400).send({
					message: errorHanlder.getErrorMessage(err)
				});
			};
			res.json(users);
		});		
	},
	show: (req, res, next, id) => {
		User.findById(id).exec((err, user) => {
			if (err) {
				return next(err);
			} else if (!user) {
				return res.status(404).send({
					message: 'No user with that identifier has been found'
				});
			}
			req.user = user;
			next();
		});
	},
	create: (req, res) => {
		User.create(req.body, (err, user) => {
			if (err) {
				return res.json({
					success: false,
					message: err
				})
			};
			const token = signJwt(user);
			res.json({
				success:true,
				message: 'User created. Token attached.',
				token
			});			
		})
	},
	update: (req, res) => {
		const user = req.user;
		user.name = req.body.name;
		User.save((err, updatedUser) => {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			};
			res.json(updatedUser);
		});
	},
	delete: (req, res) => {
		const user = req.user;
		User.remove(err => {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			};
			res.json({
				success: true,
				message: 'User deleted.', 
				user
			});
		});
	},
	authenticate: (req, res) => {
		User.findOne({ email: req.body.email }).exec((err, user) => {
			if (err) {
				return res.json({
					success: false,
					message: err
				})
			};
			if (!user) {
				return res.json({
					success: false,
					message: 'User does not exist!'
				});
			} else if (!user.validPassword(req.body.password)) {
				return res.json({
					success: false,
					message: "Invalid password!"
				});
			};
			const token = signJwt(user);
			res.status(200).send({
				success: true, 
				message: "Token attached.", 
				token
			});
		});
	}
}