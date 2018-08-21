const express = require('express'),
      router = express.Router(),
      users = require('../controllers/users'),
      checkJwt = require('../utils/auth').checkJwt;

router.route('/')
	.get(users.list)
	.post(users.create);

router.post('/authenticate', users.authenticate);

router.use(checkJwt);
router.route('/:id')
	.get(users.show)
	.patch(users.update)
	.delete(users.delete);

module.exports = router;