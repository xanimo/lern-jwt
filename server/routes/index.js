const express = require('express'),
	path = require('path'),
	user = require('./user'),
	{ checkJwt, roleAuthorization } = require('../utils/auth'),
	ROLE_ADMIN = require('../constants').ROLE_ADMIN;
	ROLE_MEMBER = require('../constants').ROLE_MEMBER,
	validator = require('validator'),
	{ exec } = require('child_process'),
	{ is_command } = require('../lib/commands'),
	{ encryptMessage, decryptMessage } = require('../utils/crypt'),
	dogeauth = require('dogeauth');

module.exports.init = (app) => {
	app.use(dogeauth.middleware);
	app.use('/api/users', user);

	app.get('/api/public', dogeauth.middleware, function (req, res) {
		if (!req.sin || req.sin != process.env.SIN) return res.status(200).json({ error: 'Unauthorized' });
		res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
	});

	app.get('/api/private', checkJwt, roleAuthorization(ROLE_ADMIN), dogeauth.middleware, async function (req, res) {
		if (!req.sin || req.sin != process.env.SIN) return res.status(200).json({ error: 'Unauthorized' });
		const decrypted =  await decryptMessage(Buffer.from(process.env.PRIVATE_KEY_HEX, 'hex'), req.headers.data);
		const decoded = decrypted.split('"""').join('').split('"').map((v, i) => {
			if (i == 1 && v != undefined) {
				return v;
			}
		})[1];
		if (is_command(decoded)) {
			exec('docker exec dogecoin dogecoin-cli ' + decoded, (error, stdout, stderr) => {
				if (error) {
					console.error(`error: ${error.message}`);
					return res.status(200).json({ message: "Hello from a private endpoint! You need to be authenticated and have a role of admin to see this.", data: error.message });
				}
				if (stderr) {
					console.error(`stderr: ${stderr}`);
					return res.status(200).json({ message: "Hello from a private endpoint! You need to be authenticated and have a role of admin to see this.", data: stderr });
				}
				return res.status(200).json({ message: "Hello from a private endpoint! You need to be authenticated and have a role of admin to see this.", data: stdout });
			});
		} else {
			res.status(200).json({ message: "Hello from a private endpoint! You need to be authenticated and have a role of admin to see this." })
		}
	});

	app.use(function (req, res) {
		res.sendFile(path.join(__dirname, "../../client/build/index.html"));
	});
}
