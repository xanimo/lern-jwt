const express = require('express'),
      Pages = require('../controllers/pages'),
      // checkJwt = require('./auth').checkJwt,
      // checkScopes = require('./auth').checkScopes,
      router = express.Router();

router.route('/')
  // .all(requireAuth)
  .get(Pages.list)
  // .post(checkJwt, checkScopes, Pages.create);
router.route('/:pageName')
  .get(Pages.readByName)
router.route('/:pageId')
  // .all(requireAuth)
  .get(Pages.read)
  // .put(checkJwt, checkScopes, Pages.update)
  // .delete(checkJwt, checkScopes, Pages.delete);
router.route('/:pageId/posts')
  .get(Pages.postsBypage);
// Finish by binding the page middleware
router.param('pageId', Pages.pageById);

module.exports = router;