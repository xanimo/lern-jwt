// const crypto = require('crypto'),
//       path = require('path'),
//       fs = require('fs'),
//       mongoose = require('mongoose'),
//       multer = require('multer'),
//       upload = multer().single('file'),
//       db = require('../db'),
//       File = require('../db/models/file'),
//       errorHandler = require('../db/error_handler');

// function dirname(req, res) {
//   return `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`;
// }

// module.exports.list = (req, res) => {

// };

// module.exports.read = (req, res) => {

// };

// module.exports.readByName = (req, res) => {
// };

// module.exports.create = (req, res) => {
//   const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       // cb(null, `${__dirname}/storage`)
//       cb(null, `${__dirname}/../../client/public/assets/images`)
//     },
//     filename: function(req, file, cb) {
//       console.log(file.originalname.split('.')[0])
//       cb(null, file.originalname.split('.')[0] + path.extname(file.originalname))
//     }
//   }),
//   upload = multer({
//     storage: storage
//   }).single('image');
//   upload(req, res, function(file, err) {
//     if (err) {
//       console.log(err)
//       return;
//     }
//     res.json(req.file);
//   })
// };

// module.exports.update = (req, res) => {

// };

// module.exports.delete = (req, res) => {

// };

// module.exports.byUser = (req, res) => {

// };

// module.exports.fileById = function (req, res, next, id) {

// };
// // import glob from 'glob';

// // const globs = {
// //   camelCaseFile: '[A-Z]*.{js,ts}',
// //   camelCaseDir: '[A-Z]*/{index,[A-Z]*}.{js,ts}',
// //   jsxFile: '*.{jsx,tsx}',
// // }

// // const filelist = (cwd: string): Promise<string[]> => {
// //  const patterns = Object.keys(globs).map(key => globs[key]),
// //    pattern = `**/{${patterns.join(',')}}`,
// //    ignore = [
// //        '**/node_modules/**',
// //        '**/{__tests__,test,tests}/**',
// //        '**/*.{test,spec}.*',       
// //    ]
// //    return new Promise((resolve, reject) => {
// //      glob(pattern, { cwd, ignore }, (err, files) => {
// //        if (err) {
// //          reject(err);
// //        };
// //        resolve(files)
// //      })
// //    });
// // }
