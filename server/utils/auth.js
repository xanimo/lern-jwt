const { getuser } = require('../db/level.js');

const jwt = require('jsonwebtoken'),
	  fs = require('fs'),
	  path = require('path'),
	  User = require('../db/models/user.js'),
	  config = require('../config'),
	  getRole = require('../helpers').getRole,
	  { APP_SECRET } = process.env;

function getTimeout() {
	const defaultTimeout = 60 * 60,
		  tokenTimeout = config.tokenTimeout;
	if (isNaN(tokenTimeout) || !tokenTimeout || tokenTimeout === 0) {
		return defaultTimeout;	
	}; 
	return tokenTimeout;
};

function signJwt(user) {
	const userData = user,
		  timestamp = Math.floor(Date.now() / 1000),
		  exp = timestamp + getTimeout();
	delete userData.password
	delete userData.sin.priv
	return jwt.sign({
		sub: userData,
		iat: timestamp,
		expiresIn: exp
	}, APP_SECRET)
}

function checkJwt(req, res, next) {
	const token = req.get('token') || req.body.token || req.query.token;
	if (!token) return res.json({
		success: false,
		message: 'No token provided!'
	});
	console.log(token);
	jwt.verify(token, APP_SECRET, (err, decodedData) => {
		if (err) return res.json({
			success: false,
			message: 'Invalid token!'
		});
		getuser(decodedData.sub.id)
		.then((user) => {
			if (!user) return res.json({
				success: false,
				message: 'Invalid token!  User does not exist!'
			});
			req.user = user;
			next()
		});
	});	
};

// Role authorization check
function roleAuthorization(requiredRole) {
	return function (req, res, next) {
		const user = req.user;
		getuser(user.id)
		.then((foundUser) => {
			// If user is found, check role.
			if (getRole(foundUser.role) >= getRole(requiredRole)) {
				return next();
			} else {
				return res.status(401).json({ error: 'You are not authorized to view this content.' });
			}
		});
	};
};

module.exports = {
	signJwt,
	checkJwt,
	roleAuthorization
}