const dogeauth = require('dogeauth');
const { generateRandomPassphrase } = require('../models/user');
const { init } = require('@paralleldrive/cuid2');
const {
    randomBytes,
  } = import('node:crypto');

  // The init function returns a custom createId function with the specified
// configuration. All configuration properties are optional.
const createId = init({
  // A custom random function with the same API as Math.random.
  // You can use this to pass a cryptographically secure random function.
  random: randomBytes,
  // the length of the id
  length: 64,
  // A custom fingerprint for the host environment. This is used to help
  // prevent collisions when generating ids in a distributed system.
  fingerprint: process.env.APP_SECRET,
});

module.exports.data = [
  {
    model: 'User',
    documents: [
      {
        id: createId(),
        sin: dogeauth.generateSin(),
        password: generateRandomPassphrase(),
        role: 'Admin'
      },
      {
        id: createId(),
        sin: dogeauth.generateSin(),
        password: generateRandomPassphrase(),
        role: 'Owner'
      },
      {
        id: createId(),
        sin: dogeauth.generateSin(),
        password: generateRandomPassphrase(),
        role: 'Client'
      },
      {
        id: createId(),
        sin: dogeauth.generateSin(),
        password: generateRandomPassphrase(),
        role: 'Member'
      },
    ]
  }
];
