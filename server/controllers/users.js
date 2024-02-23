const User = require('../db/models/user'),
	{ getErrorMessage } = require('../db/error_handler'),
	signJwt = require('../utils/auth').signJwt;

module.exports = {
	list: (req, res) => {
		User.find().sort('name').exec().then((users) => {
			const filteredUsers = users.filter((user) => {
				const { password, ...responseUser } = user._doc;
				return responseUser;
			})
			return res.status(200).json(filteredUsers);
		})
		.catch((err) => {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		});
	},
	show: (req, res, next, id) => {
		User.findById(id)
			.then((user) => {
				if (!user) {
					return res.status(404).send({
						message: 'No user with that identifier has been found'
					});
				}
				req.user = user;
				next();
			})
			.catch((err) => {
				return next(err);
			});
	},
	create: (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		const firstName = req.body.firstName || '';
		const lastName = req.body.lastName || '';
		// For security measurement we remove the roles from the req.body object
		delete req.body.roles;

		// Return error if no email provided
		if (!email) {
			console.log('you must enter email')
			return res.status(422).send({ error: 'You must enter an email address.' });
		}

		// Return error if full name not provided
		if (!firstName || !lastName) {
			console.log('fullName')
			return res.status(422).send({ error: 'You must enter your full name.' });
		}

		// Return error if no password provided
		if (!password) {
			console.log('no password')
			return res.status(422).send({ error: 'You must enter a password.' });
		}
		// See if user with email exists
		User.findOne({ email })
			.then((existingUser) => {
				// If user is not unique, return error
				if (existingUser) {
					return res.status(422).send({ error: 'That email address is already in use.' });
				}
				User.create(req.body)
					.then((user) => {
						const token = signJwt(user);
						return res.json({
							success: true,
							message: 'User created. Token attached.',
							token
						});
					})
					.catch((err) => {
						console.log(err);
						return res.json({
							success: false,
							message: err
						})
					});
			})
			.catch((err) => {
				console.log('err');
				console.log(err);
				return next(err);
			});
	},
	update: async (req, res, id) => {
		const filter = { email: req.body.email };
		const update = { password: User.generateHash(req.body.password_one) };
		// See if user with email exists
		await User.findOneAndUpdate(filter, update)
			.then((existingUser) => {
				console.log(existingUser)
				if (!existingUser) {
					return res.status(422).send({ error: 'User could not be found.' });
				}
				const token = signJwt(existingUser);
				return res.status(200).send({
					success: true,
					message: "Token attached.",
					token
				});
			})
			.catch((error) => {
				console.log(error);
				return error;
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
		console.log(req.body.email)
		User.findOne({ email: req.body.email })
			.then((user) => {
				console.log(user);
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
				return res.status(200).send({
					success: true,
					message: "Token attached.",
					token
				});
			})
			.catch((err) => {
				if (err) {
					return res.json({
						success: false,
						message: err
					})
				};
			});
	}
}
