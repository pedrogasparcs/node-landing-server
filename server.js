var vhost = require('./helpers/vhost-config');
var aslptemplator = require('./helpers/as-lp-templator');
var vab = require('./helpers/vab-deploy');
var constants = require('./config/constants');
//
var authenticator = require('./routes/authenticator')
var manager = require('./routes/manager')
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
var lessMiddleware = require('less-middleware');

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
var bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap');
app.use('/img', express['static'](path.join(bootstrapPath, 'img')));
app.use(lessMiddleware({
    src    : path.join(__dirname, 'public/css', 'less'),
    paths  : [path.join(bootstrapPath, 'less')],
    dest   : path.join(__dirname, 'public', 'css'),
    prefix : '/css',
    debug: true
}));
*/
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
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

app.use(function (req, res, next) {
    if (req.path.indexOf('/auth') === -1) {
        req.session.urlAfterLogin = req.url;
    }
    //console.log (req.session.urlAfterLogin);
    next ();
});

app.use(function (req, res, next) {
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

app.use('/auth', authenticator);
app.use('/manager', manager);

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