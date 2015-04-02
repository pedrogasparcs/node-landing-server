var vhost = require('./helpers/vhost-config');
var aslptemplator = require('./helpers/as-lp-templator');
var vab = require('./helpers/vab');
var constants = require('.config/constants');
//
var compression = require('compression');
var express = require('express');
var multer = require('multer');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*
INSTANTIATE SERVER
 */
var app = express();
app.basepath = __dirname;
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

app.use('/config-hosts-versions', function (req, res, next) {
    var Config = app.models('Config').model;
    var q = Config.remove ({});
    q.exec ();
    var remaxConfig = {
        webapp: 'www.remax-vivant.com',
        client: 'Remax',
        atdata: {

        },
        meta:[{
            title: 'Remax',
            description: 'Descrição Remax',
            iso: 'pt',
            keywords: 'Keywords Remax'
        }],
        versions:[
        ]};
    var potatoConfig = {
        webapp: 'www.potato.com',
        client: 'Potato',
        meta:[{
            title: 'Potato',
            description: 'Descrição Potato',
            iso: 'pt',
            keywords: 'Keywords Potato'
        }],
        versions:[
            {
                path:'/'
            }
            ,{
                path:'macacos/'
            }
        ]};
    var tomatoConfig = {
        webapp: 'www.tomato.com',
        client: 'Tomato',
        atdata: {

        },
        meta:[{
            title: 'Tomato',
            description: 'Descrição Tomato',
            iso: 'pt',
            keywords: 'Keywords Tomato'
        }],
        versions:[
            {
                path:'/'
            }
            ,{
                path:'macacos/'
            }
        ]};
    var t = new Config (remaxConfig).save ();
    var t = new Config (potatoConfig).save ();
    var t = new Config (tomatoConfig).save ();
    //res.send ("DONE SAVING CONFIGURATION");
    //
    setTimeout(function ()
    {
        aslptemplator.prepare (potatoConfig);
        aslptemplator.prepare (tomatoConfig);
        res.send ("DONE PROCESSING TEMPLATES");
    }, 3000);
});

app.get('/load-version-form', function (req, res, next) {
    res.sendFile(constants.systempublicpath + 'load-version-form.html');
});
app.post('/load-version', function (req, res, next) {
    vab.deploy(req.body.webapp, __dirname, req.files.zip, constants.vhostspublicpath);
    /*
    console.log (req.files);
    console.log (req.body);
    */
    res.send ("CÁ VEIO");
});
app.get('/')
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
CONFIGURE VHOSTS
 */
function reloadHosts (req, res, next) {
    // - load configuration file and iterate
    vhost.config(app, '*.remax-vivant.com', constants.vhostspublicpath + 'www.remax-vivant.com');
    vhost.config(app, '*.tomato.com', constants.vhostspublicpath + 'www.tomato.com');
    vhost.config(app, '*.potato.com', constants.vhostspublicpath + 'www.potato.com');
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