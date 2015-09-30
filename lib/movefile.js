'use strict';

var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

module.exports = function (setting) {
  return (req, res, next) => {
    let promises = [];
    let filesPath = {}

    for(var i = 0; i < setting.fields.length; i++) {
      let fieldName = setting.fields[i].name;
      let files = req.files[fieldName];

      /* init an array to store public filesPath for each field */
      filesPath[fieldName] = []
      filesPath[fieldName].length = files.length;

      files.forEach((file, fileIndex) => {
        /* if the destination is a function then call it to get the
           real relative destination folder */
        let _relDestFolder;
        if (typeof setting.destination === 'function')
          _relDestFolder = setting.destination(req, file);

        promises.push(new Promise((resolve, reject) => {
          /* make sure the destination folder exist
             we just ignore the race condiction here
             because if race condiction do happen, it should always fail */
          mkdirp(path.join(setting.root, _relDestFolder), (err) => {
            /* if we fail to create destination folder, reject with error */
            if(err) return reject(err);
            let publicFilePath = path.join(_relDestFolder, setting.filename(req, file));
            let absFilePath = path.join(setting.root, publicFilePath);
            fs.rename(file.path, absFilePath, (err) => {
              if(err) return reject(err); /* If failure, reject with error */
              /* Add the field to the destination file path */
              filesPath[fieldName][fileIndex] = publicFilePath;
              resolve();
            });
          });
        }));
      });
    };

    /* promise that all file operations success */
    /* when there is an error, the first parameter of `catch` callback function
       has an error object thus `next` can pass it to error handler */
    Promise.all(promises).then(()=> {
      req.filesPath = filesPath;
      next();
    }).catch(next);
  };
};
