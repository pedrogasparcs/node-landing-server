/**
 * Created by pedro on 31/03/15.
 */
var fs = require('fs');
var models = require('../models');
var constants = require('../config/constants');

function prepareTemplate (configuration) {
    var staticsbasedir = constants.vhostspublicpath;
    var WebApp = models('WebApp').model;
    var webapps = WebApp.find ({webapp:configuration.webapp}, function (err, docs) {
        if (docs !== null && docs.length !== 0) {
            if (docs[0].versions.length === 0) {
                fileTo = staticsbasedir + docs[0].webapp + '/' + constants.defaultdocument;
                replaceTemplateKeywords (fileTo, configuration);
            }
            else {
                var i;
                for(i=0; i < docs[0].versions.length; i++) {
                    pathTo = docs[0].versions[i].path;
                    fileTo = staticsbasedir + docs[0].webapp + '/' + pathTo + constants.defaultdocument;
                    var rep = docs[0].versions[i].meta.length > 0?docs[0].versions[i].meta[0]:docs[0].meta[0];
                    replaceTemplateKeywords (fileTo, docs[0], rep);
                }
            }
        }
    });
}

function replaceTemplateKeywords (templatePath_in, generalConfig_in, meta_in) {
    fs.readFile(templatePath_in, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        //backup original
        fs.writeFile(templatePath_in + '.bck', data, function (err) {
            if (err) {
                throw err;
            }
        });

        var metaData = '<title>'+ meta_in.title + '</title>' +
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
        '<meta property="og:title" content="'+ meta_in.title + '"/>' +
        '<meta property="og:type" content="website" />' +
        '<meta property="og:image" content="http://' + generalConfig_in.webapp + '/images/fbshare.jpg" />' +
        '<meta property="og:description" content="'+ meta_in.description + '" />' +
        '<meta property="og:locale" content="'+ meta_in.title.toLowerCase () + '_'+ meta_in.title + '" />' +
        '<meta property="og:url" content="http://' + generalConfig_in.webapp + '" />' +
        '<meta name="title" content="'+ meta_in.title + '" />' +
        '<meta name="description" content="'+ meta_in.description + '" />' +
        '<meta name="subject" content="'+ meta_in.description + '" />' +
        '<meta name="keywords" lang="<?= ISO ?>" content="'+ meta_in.keywords + '" />' +
        '<meta name="abstract" content="'+ meta_in.keywords + '" />' +
        '<meta name="resource-type" content="document" />' +
        '<meta name="distribution" content="global" />' +
        '<meta name="rating" content="general" />' +
        '<meta name="robots" content="index, follow" />' +
        '<meta name="alexa" content="100" />' +
        '<meta name="pagerank" content="10" />' +
        '<meta name="url" content="http://www.' + generalConfig_in.webapp + '" />' +
        '<meta name="audience" content="all" />' +
        '<meta name="copyright" content="' + generalConfig_in.client + '" />' +
        '<meta name="classification" content="commercial" />' +
        '<link rel="image_src" type="image/jpeg" href="http://'+ generalConfig_in.webapp + '/images/fbshare.jpg"/>' +
        '<link rel="Shortcut Icon" href="images/favicon.ico" />' +
        '<link type="text/css" href="https://code.jquery.com/ui/1.10.1/jquery-ui.min.js" rel="stylesheet" />' +
        '<style type="text/css">.ui-menu-item{text-align: left;font-size: 12px!important;}</style>' +
        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>';

        var data = data.replace('{{META_CONFIG}}', metaData);
        fs.writeFile(templatePath_in, data, function (err) {
            if (err) {
                throw err;
            }
        });
    });
}

module.exports = {
    prepare: prepareTemplate
}