const express = require('express'),
      Tags = require('../controllers/tags'),
      // checkJwt = require('./auth').checkJwt,
      // checkScopes = require('./auth').checkScopes,
      router = express.Router();

router.route('/')
  // .all(requireAuth)
  .get(Tags.list)
  // .post(checkJwt, checkScopes, Tags.create);
router.route('/:tagId')
  // .all(requireAuth)
  .get(Tags.read)
  // .put(checkJwt, checkScopes, Tags.update)
  // .delete(checkJwt, checkScopes, Tags.delete);
router.route('/:tagId/posts')
  .get(Tags.postsByTag);
// Finish by binding the tag middleware
router.param('tagId', Tags.tagById);
module.exports = router;