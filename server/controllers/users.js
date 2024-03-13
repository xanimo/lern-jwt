const { hashPassword } = require('../db/models/user'),
	{ getErrorMessage } = require('../db/error_handler'),
	{ getAllUsers, getuser, updateUser, deleteUser } = require('../db/level'),
	signJwt = require('../utils/auth').signJwt,
	{ JsonToArray, binArrayToJson } = require('../utils/json'),
	{ encryptMessage, decryptMessage } = require('../utils/crypt');
	
	var dogeauth = require('dogeauth');
const { filter } = require('lodash');

	const fromHexString = (hexString) =>
	Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  
  const toHexString = (bytes) =>
	bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

module.exports = {
	list: async (req, res) => {
		console.log(req.body);
		delete req.user;
		return await getAllUsers()
		.then(async (users) => {
			console.log('list', users);
			const filteredUsers = users.filter((user) => {
				delete user.sin.priv
				delete user.password
				return user;
			});
			const encoded = Buffer.from(JsonToArray(filteredUsers));
			const encrypted = await encryptMessage(Buffer.from(process.env.PRIVATE_KEY_HEX, 'hex'), encoded);
			return res.status(200).send(Buffer.from(encrypted, 'binary'));
		})
		.catch((err) => {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		});
	},
	show: (req, res, next, id) => {
		console.log('show', req.body);
		getuser(process.env.ID).then((user) => {
			// console.log(user);
		})
		// User.findById(id)
		// 	.then((user) => {
		// 		if (!user) {
		// 			return res.status(404).send({
		// 				message: 'No user with that identifier has been found'
		// 			});
		// 		}
		// 		req.user = user;
		// 		next();
		// 	})
		// 	.catch((err) => {
		// 		return next(err);
		// 	});
	},
	create: (req, res) => {
		const id = req.body.id;
		const password = req.body.password;
		// For security measurement we remove the roles from the req.body object
		delete req.body.roles;

		// Return error if no email provided
		if (!id) {
			console.log('you must enter an id')
			return res.status(422).send({ error: 'You must enter an id.' });
		}

		// Return error if no password provided
		if (!password) {
			console.log('no password')
			return res.status(422).send({ error: 'You must enter a password.' });
		}


		// See if user with email exists
		// User.findOne({ email })
		// 	.then((existingUser) => {
		// 		// If user is not unique, return error
		// 		if (existingUser) {
		// 			return res.status(422).send({ error: 'That email address is already in use.' });
		// 		}
		// 		User.create(req.body)
		// 			.then((user) => {
		// 				const token = signJwt(user);
		// 				return res.json({
		// 					success: true,
		// 					message: 'User created. Token attached.',
		// 					token
		// 				});
		// 			})
		// 			.catch((err) => {
		// 				console.log(err);
		// 				return res.json({
		// 					success: false,
		// 					message: err
		// 				})
		// 			});
		// 	})
		// 	.catch((err) => {
		// 		console.log('err');
		// 		console.log(err);
		// 		return next(err);
		// 	});
	},
	update: async (req, res, id) => {
		const decrypted =  await decryptMessage(Buffer.from(process.env.PRIVATE_KEY_HEX, 'hex'), req.body.encrypted);
		console.log(decrypted);
		const decoded = JSON.parse(decrypted);
		console.log(decoded);
		const user = decoded.id;
		console.log(user);
		return await updateUser(decoded.id, 'password', hashPassword(decoded.password_one))
		.then((user) => {
			console.log('user', user);
			if (!user) {
				return res.status(422).send({ error: 'User could not be found.' });
			}
			const token = signJwt(user);
			return res.status(200).send({
				success: true,
				message: "Token attached.",
				token,
			});
		})
		.catch((err) => {
			return res.status(400).send({
				message: getErrorMessage(err),
			});
		})
	},
	delete: async (req, res) => {
		const user = req.user;
		await deleteUser(user, user.id).then((value) => {
			return res.json({
				success: true,
				message: 'User deleted.',
				user
			});
		})
		.catch((err) => {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
			});
		});
	},
	authenticate: async (req, res) => {
		const decrypted =  await decryptMessage(Buffer.from(process.env.PRIVATE_KEY_HEX, 'hex'), req.body.encrypted);
		const decoded = JSON.parse(decrypted);
		if (decrypted.password != hashPassword(req.body.password)) {
			return res.json({
				success: false,
				message: 'Password is incorrect!'
			});
		}
		getuser(decoded.id).then((user) => {
			if (!user) {
				return res.json({
					success: false,
					message: 'User does not exist!'
				});
			}
			const token = signJwt(user);
			return res.status(200).send({
				success: true,
				message: "Token attached.",
				token
			});
		})
	}
}
