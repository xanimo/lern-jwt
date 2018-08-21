const express = require('express'),
      Posts = require('../controllers/posts'),
      // checkJwt = require('./auth').checkJwt,
      // checkScopes = require('./auth').checkScopes,
      router = express.Router();

router.route('/')
  // .all(requireAuth)
  .get(Posts.list)
  // .post(checkJwt, checkScopes, Posts.create);
router.route('/:pageId')
  // .all(requireAuth)
  .get(Posts.read)
  // .put(checkJwt, checkScopes, Posts.update)
  // .delete(checkJwt, checkScopes, Posts.delete);
router.route('/:postId/tags')
  .get(Posts.tagsByPost);
// Finish by binding the Post middleware
router.param('postId', Posts.postById);

module.exports = router;