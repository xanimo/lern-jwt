const jwt = require('jsonwebtoken'),
	  fs = require('fs'),
	  path = require('path'),
	  User = require('../db/models/user.js'),
	  config = require('../config'),
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
	const userData = user.toObject(),
		  timestamp = Math.floor(Date.now() / 1000),
		  exp = timestamp + getTimeout();
	delete userData.password
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
	jwt.verify(token, APP_SECRET, (err, decodedData) => {
		if (err) return res.json({
			success: false,
			message: 'Invalid token!'
		});
		User.findById(decodedData._id, (err, user) => {
			if (!user) return res.json({
				success: false,
				message: 'Invalid token!  User does not exist!'
			});
			req.user = user;
			next()
		});
	});	
};

module.exports = {
	signJwt,
	checkJwt
}