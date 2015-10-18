'use strict';

/**
 * Module dependencies.
 */

var multer = require('multer'),
    movefile = require('./movefile'),
    path = require('path'),
    os = require('os'),
    mkdirp = require('mkdirp'),
    crypto = require('crypto');

/**
 * Store a temporary path for uploader
 */

var tempDirectory = path.join(os.tmpdir(), 'dest-multer');
mkdirp.sync(tempDirectory);

/**
 * Expose
 */

module.exports = function(setting) {
  if(!setting)
    throw 'You must specify setting parameter in folder-multer.';
  if(!setting.root)
    throw 'You must specify the root of your uploaded file.';
  if(!setting.destination)
    throw 'You must specify a destination (relative to root) in either string or callback type in file-multer.';
  if(!setting.fields)
    throw 'You must specify fields of your multipart form.'
  if(!setting.filename)
    setting.filename = (req, file) =>
      Date.now().toString(36)+crypto.randomBytes(3).toString('hex') + path.extname(file.originalname);

  /* init multer and get middleware */
  var multerMiddle = multer({ dest: tempDirectory, limits: setting.limits }).fields(setting.fields);

  /* return combined middlewares */
  return [multerMiddle, movefile(setting)];
};
