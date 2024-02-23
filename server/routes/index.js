const express = require('express'),
	path = require('path'),
	user = require('./user'),
	{ checkJwt, roleAuthorization } = require('../utils/auth'),
	ROLE_ADMIN = require('../constants').ROLE_ADMIN;
	ROLE_MEMBER = require('../constants').ROLE_MEMBER;

module.exports.init = (app) => {
	app.use('/api/users', user);

	app.get('/api/public', function(req, res) {
	  res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
	});

	app.get('/api/private', checkJwt, roleAuthorization(ROLE_ADMIN), function(req, res) {
	  	res.status(200).json({ message: "Hello from a private endpoint! You need to be authenticated and have a role of admin to see this." });
	});

	app.use(function(req, res) {
		res.sendFile(path.join(__dirname, "../../client/build/index.html"));
	});
}