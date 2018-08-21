const express = require('express'),
      // checkJwt = require('./auth').checkJwt,
      // checkScopes = require('./auth').checkScopes,
      Files = require('../controllers/files'),
      router = express.Router();

router.route('/images')
  // .all(checkJwt, checkScopes)
  .get(Files.list)
  .post(Files.create);
router.route('/:fileName')
  // .all(checkJwt, checkScopes)
  .get(Files.readByName)
router.route('/:fileId')
  // .all(checkJwt, checkScopes)
  .get(Files.read)
  .put(Files.update)
  .delete(Files.delete);
// Finish by binding the file middleware
router.param('fileId', Files.fileById);

module.exports = router;