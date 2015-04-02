/**
 * Created by pedro on 31/03/15.
 */
var unzip = require('unzip');
var fs = require('fs');
var models = require('../models/');
var aslptemplator = require('../helpers/as-lp-templator');
var constants = require('../config/constants')

/*
@webapp_in - system-wide identification and public directory
@baseDir_in - working directory
@file_in - expected to be an object in multer format, at least: {path: full_path, name: name plus extension}
@outputBase_in - base directory, usually the public
 */
function deploy (webapp_in, baseDir_in, file_in, outputBase_in) {
    var zipFile = baseDir_in + '/' + file_in.path;
    var versionFolder = file_in.name.substr (0, file_in.name.indexOf('.zip'));
    var destinationDir = baseDir_in + outputBase_in + webapp_in + '/' + constants.vabsdirectory + versionFolder;
    var extraction = unzip.Extract({ path: destinationDir })
    extraction.on ('close', function (param) {
        var WebApp = models('WebApp').model;
        WebApp.find ({webapp:webapp_in}, function (err, doc) {
            doc[0].versions.push ({
                path: constants.vabsdirectory + versionFolder + '/',
                meta: doc[0].meta
            });
            WebApp.findOneAndUpdate ({webapp:webapp_in}, {versions: doc[0].versions}, function (err, docf) {
                aslptemplator.prepare(docf);
            });
        });
    });
    fs.createReadStream(zipFile).pipe(extraction);
}

module.exports = {
    deploy: deploy
}