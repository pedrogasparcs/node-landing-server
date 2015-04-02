var vhost = require('./helpers/vhost-config');
var aslptemplator = require('./helpers/as-lp-templator');
var vab = require('./helpers/vab-deploy');
var authenticator = require('./routes/authenticator')
var constants = require('./config/constants');
//
var compression = require('compression');
var express = require('express');
var session = require('express-session');
var multer = require('multer');
var passport = require('passport')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*
INSTANTIATE SERVER
 */
var app = express();
/*
Basic middleware for sessions and authentications
 */
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'actualtrade' }));
app.use(passport.initialize());
app.use(passport.session());
/*
Views configuration
 */
app.set('views', './views');
app.set('view engine', 'jade');
/*
SERVER NEEDED MODELS
 */
app.models = require('./models');
var Request = app.models('Request').model;

/*
DEFINE SERVER GENERAL MIDDLEWARE
 */

// compress all requests
app.use(compression());
app.use(multer({ dest: constants.uploadspath})); // middleware that handle all multipart/form-data forms and provides info on the routes req object
app.use('/auth', authenticator);

app.get('/load-version-form', function (req, res, next) {
    console.log (req.session);
    res.sendFile(constants.systempublicpath + 'load-version-form.html');
});
app.post('/load-version', function (req, res, next) {
    vab.deploy(req.body.webapp, req.files.zip, constants.vhostspublicpath);
    /*
    console.log (req.files);
    console.log (req.body);
    */
    res.redirect ('/load-version-form?deployed=1');
});
app.use('/', function (req, res, next) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var lastPart = req.originalUrl.substr (req.originalUrl.lastIndexOf("/"));
    if (lastPart === "/" || lastPart === "/" + constants.defaultdocument) {
        var req1 = new Request({ name: fullUrl});
        req1.save(function (err) {
            if (err) {
                console.log('error logging request');
            }
        });
    }
    next();
});

/*
VHosts Setup
 */
function reloadHosts (req, res, next) {
    var WebApp = app.models('WebApp').model;
    var webapps = WebApp.find ({}, function (err, docs) {
        if (docs.length > 0) {
            var i=0;
            for(i=0; i < docs.length; i++) {
                if (docs[i].webapp.indexOf("www.") === 0) {
                    vhost.config(app, '*.' + docs[i].webapp.substr(4), constants.vhostspublicpath + docs[i].webapp);
                }
                else {
                    vhost.config(app, docs[i].webapp, constants.vhostspublicpath + docs[i].webapp);
                }
            }
        }
    });
    /*
    // - load configuration file and iterate
    vhost.config(app, '*.remax-vivant.com', constants.vhostspublicpath + 'www.remax-vivant.com');
    vhost.config(app, '*.tomato.com', constants.vhostspublicpath + 'www.tomato.com');
    vhost.config(app, '*.potato.com', constants.vhostspublicpath + 'www.potato.com');
    */
    if(res) {
        res.send ("DONE RELOAD HOSTS");
    }
}
reloadHosts ();
app.use('/reload-hosts', reloadHosts);

/*
START SERVER
 */
app.listen(3000);

module.exports = app;