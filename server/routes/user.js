const express = require('express'),
      router = express.Router(),
      users = require('../controllers/users'),
      checkJwt = require('../utils/auth').checkJwt;

router.route('/')
	.get(checkJwt, users.list)
	.post(users.create);

router.route('/:id')
	.get(users.show)
	.patch(users.update)
	.delete(users.delete);

router.post('/authenticate', users.authenticate);

module.exports = router;
