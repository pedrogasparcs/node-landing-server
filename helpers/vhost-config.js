/**
 * Created by pedro on 31/03/15.
 */
var express = require('express');
var compression = require('compression');
var vhost = require('vhost');
var serveStatic = require('serve-static');
var constants = require('../config/constants')

function staticApp (app_in, publicPath_in) {
    var host = express();
    host.use(compression());
    host.use('/', function (req, res, next) {
        // validate it's the indexes
        var lastPart = req.path.substr (req.path.lastIndexOf("/"));
        if (lastPart === "/" || lastPart === "/" + constants.defaultdocument) {
            // get document base url
            var hostPlusUrl = req.get('host').substr (0, req.get('host').indexOf(":")) + req.originalUrl;
            var appbase = hostPlusUrl.substr (0, String(hostPlusUrl).lastIndexOf ("/"));
            var Config = app_in.models('Config').model;
            var configs = Config.find ({webapp: appbase}, function (err, docs) {
                console.log (docs);
                var pathTo, fileTo;
                if (docs === null || docs.length === 0 || docs[0].versions.length === 0) {
                    fileTo = constants.vhostspublicpath + appbase + '/' + constants.defaultdocument;
                }
                else if (docs[0].versions.length === 1) {
                    pathTo = docs[0].versions[0].path;
                    fileTo = constants.vhostspublicpath + appbase + '/' + pathTo + constants.defaultdocument;
                }
                else
                {
                    if (req.query.vab !== undefined) {
                        pathTo = docs[0].versions[req.query.vab].path;
                    }
                    else {
                        pathTo = docs[0].versions[Math.round(Math.random()*(docs[0].versions.length-1))].path;
                    }
                    fileTo = constants.vhostspublicpath + appbase + '/' + pathTo + constants.defaultdocument;
                }
                //console.log (fileTo);
                res.sendFile (fileTo);
            });
        }
        else {
            //console.log ("static");
            next (); // LET THE STATIC MIDDLEWARE RESOLVE
        }
    });
    host.use(serveStatic(publicPath_in));
    return host;
}
function configVhost (app_in, domain_in, publicPath_in)
{
    var domainApp = staticApp (app_in, publicPath_in);
    app_in.use(vhost(domain_in, domainApp));
    if (domain_in.indexOf ("*.") != -1) {
        var t = domain_in.substr (domain_in.indexOf("*.") + 2);
        app_in.use(vhost(t, domainApp));
    }
    return domainApp;
}

module.exports = {
    config: configVhost
}