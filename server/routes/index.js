const express = require('express'),
	path = require('path'),
	user = require('./user'),
	{ checkJwt, roleAuthorization } = require('../utils/auth'),
	ROLE_ADMIN = require('../constants').ROLE_ADMIN;
	ROLE_MEMBER = require('../constants').ROLE_MEMBER,
	validator = require('validator'),
	{ exec } = require('child_process'),
	{ is_command } = require('../lib/commands');

module.exports.init = (app) => {
	app.use('/api/users', user);

	app.get('/api/public', function(req, res) {
	  res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
	});
	app.get('/api/private/:cmd', checkJwt, roleAuthorization(ROLE_ADMIN), function(req, res) {
		if (is_command(req.params.cmd)) {
			if (req.query.args == "undefined") {
				req.query.args = null;
			} else {
				req.params.args = ' ' + req.query.args;
			}
			exec('docker exec dogecoin-dogecoin-1 dogecoin-cli ' + 	req.params.cmd + ' ' + req.query.args, (error, stdout, stderr) => {
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

	app.use(function(req, res) {
		res.sendFile(path.join(__dirname, "../../client/build/index.html"));
	});
}
