'use strict';

var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

module.exports = function (setting) {
  return (req, res, next) => {
    let promises = [];
    req.filesPath = {}

    for(var i = 0; i < setting.fields.length; i++) {
      let fieldName = setting.fields[i].name;
      let files = req.files[fieldName];

      /* init an array to store public filesPath for each field */
      req.filesPath[fieldName] = []
      req.filesPath[fieldName].length = files.length;

      files.forEach((file, fileIndex) => {
        /* if the destination is a function then call it to get the
           real relative destination folder */
        let _relDestFolder;
        if (typeof setting.destination === 'function')
          _relDestFolder = setting.destination(req, file);
        else
          _relDestFolder = setting.destination;

        promises.push(new Promise((resolve, reject) => {
          /* make sure the destination folder exist
             we just ignore the race condiction here
             because if race condiction do happen, it should always fail */
          mkdirp(path.join(setting.root, _relDestFolder), (err) => {
            /* if we fail to create destination folder, reject with error */
            if(err) return reject(err);
            let _filename = setting.filename(req, file);
            let _publicFilePath = path.join(_relDestFolder, _filename);
            let _absFilePath = path.join(setting.root, _publicFilePath);
            let _absDestination = path.join(setting.root, _relDestFolder);
            fs.rename(file.path, _absFilePath, (err) => {
              if(err) return reject(err); /* If failure, reject with error */
              /* Add the field to the destination file path */
              req.filesPath[fieldName][fileIndex] = _publicFilePath;
              req.files[fieldName][fileIndex].path = _absFilePath;
              req.files[fieldName][fileIndex].destination = _absDestination;
              req.files[fieldName][fileIndex].filename = _filename;
              resolve();
            });
          });
        }));
      });
    };

    /* promise that all file operations success */
    /* when there is an error, the first parameter of `catch` callback function
       has an error object thus `next` can pass it to error handler */
    Promise.all(promises).then(() => next()).catch(next);
  };
};
