/**
 * Created by pedro on 02/04/15.
 */
var constants = require('../config/constants');
var dbconfig = require('../config/database');

var express = require('express');
//var router = express.Router();
var models = require('../models/index');
var flash = require('connect-flash');

var compression = require('compression');
var session = require('express-session');
var multer = require('multer');
var passport = require('passport')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var MongoStore = require('connect-mongo')(session);


var app = express();
app.use(compression());
app.use(multer({ dest: constants.uploadspath})); // middleware that handle all multipart/form-data forms and provides info on the routes req object
app.use(flash());


/*
 Basic middleware for sessions and authentications
 */
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'actualtrade',
    store: new MongoStore({ url: dbconfig.mongoserver + dbconfig.mongodb }) }));
app.use(passport.initialize());
app.use(passport.session());
/*
 Views configuration
 */
app.set('views', './views');
app.set('view engine', 'jade');

app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use (function (req, res, next) {
    if (!req.user) {
        res.redirect ('/auth/login');
    }
    else {
        next ();
    }
});
// SSO INTEGRATION
app.use ('/auth/login', function (req, res, next){

});
app.use ('/auth/logout', function (req, res, next){

});
// - SSO INTEGRATION

app.get(['/', '/webapp'], function (req, res, next) {
    res.redirect ('/webapp/list/');
});
app.get('/vab/add/', function (req, res, next) {
    var WebApp = models('WebApp').model;
    WebApp.find ({webapp:req.body.webapp}, function (err, docs) {
        if (docs.length !== 0) {
            console.log (docs);
            res.render ('manager/vab-form', {
                webapps: ['teste', 'teste1']
            });
        }
        else {
            res.redirect ('/webapp/add/?nowebapps=1');
        }
    });
});
app.post('/vab/add/', function (req, res, next) {
    vab.deploy(req.body.webapp, req.files.zip, constants.vhostspublicpath);
    /*
     console.log (req.files);
     console.log (req.body);
     */
    res.redirect ('/vab/add/?deployed=1');
});

app.get('/webapp/:id/vabs/list/:page?/:pageSize?', function (req, res, next) {
    var page = req.params.page?req.params.page:1;
    var pageSize = req.params.pageSize?req.params.pageSize:constants.listsDefaultSize;
    var WebApp = models('WebApp').model;

    WebApp.find ({_id:req.params.id}, function (err, docs) {
        if (docs.length !== 0) {
            console.log (docs);
            res.render ('manager/vab-form', {
                webapps: ['teste', 'teste1']
            });
        }
        else {
            res.redirect ('/webapp/add/?nowebapps=1');
        }
    });

    /*
    WebApp.paginate ({}, page, pageSize, function (err, pageCount, docs, docsCount) {
        if (docs.length !== 0) {
            res.render('manager/webapp-list', {
                intro: {
                    title: 'Lista de WebApps Configuradas'
                    , description: ''
                }
                , managerModule:'webapp'
                , webapps: docs
                , page: page
                , pages: pageCount
                , numRecs:docsCount
                , pageSize: pageSize
                , availablePageSizes:constants.listsAvailableSizes
            });
        }
        else {
            res.redirect('/manager/webapp/add/?nowebappsonlist=1');
        }
    });
    */
});

//--------------------------------//

app.get('/webapp/list/:page?/:pageSize?', function (req, res, next) {
    var page = req.params.page?req.params.page:1;
    var pageSize = req.params.pageSize?req.params.pageSize:constants.listsDefaultSize;
    var WebApp = models('WebApp').model;
    WebApp.paginate ({deleted: false}, page, pageSize, function (err, pageCount, docs, docsCount) {
        if (docs.length !== 0) {
            res.render('manager/webapp-list', {
                intro: {
                    title: 'Lista de WebApps Configuradas'
                    , description: ''
                }
                , managerModule:'webapp'
                , webapps: docs
                , page: page
                , pages: pageCount
                , numRecs:docsCount
                , pageSize: pageSize
                , availablePageSizes:constants.listsAvailableSizes
            });
        }
        else {
            res.redirect('/webapp/add/?nowebappsonlist=1');
        }
    });
});
app.get('/webapp/edit/:id', function (req, res, next) {
    var WebApp = models('WebApp').model;
    WebApp.find ({_id:req.params.id}).populate('meta').exec (function (err, doc) {
        if (doc.length !== 0){
            res.render ('manager/webapp-form', {webapp:doc[0], action:'edit'});
        }
        else {
            res.redirect ('/webapp/add/?nowebappsonlist=1');
        }
    });
    //res.sendFile(constants.systempublicpath + 'load-version-form.html');
});
app.post('/webapp/edit/', function (req, res, next) {
    var WebApp = models('WebApp').model;
    var WebAppMetaData = models('WebAppMetaData').model;
    WebApp.find ({_id:req.body.id}).populate('meta').exec (function (err, doc) {
        if (doc.length !== 0) {
            var webappConf = doc[0]; //.toObject();
            WebAppMetaData.find ({_id:webappConf.meta}, function (err, metaDoc) {
                if (metaDoc.length !== 0) {
                    var metaConf = metaDoc[0]; //.toObject();
                    metaConf.title = req.body["md-title"];
                    metaConf.description = req.body["md-description"];
                    metaConf.keywords = req.body["md-keywords"];
                    webappConf.webapp = req.body.webapp;
                    webappConf.client = req.body.client;
                    webappConf.campaignid = req.body["bd-cmpid"];
                    webappConf.cpnid = req.body["bd-cpnid"];
                    webappConf.meta = metaConf;
                    metaConf.touch (function (err) {
                        if (!err) {
                            webappConf.touch (function (err) {
                                if (!err) {
                                    res.redirect('/webapp/list/?successEditing=1');
                                }
                                else {
                                    res.redirect('/webapp/list/?errorEditing=1');
                                }
                            });
                        }
                        else {
                            res.redirect('/webapp/list/?errorEditing=1');
                        }
                    });
                }
            });
        }
    });
});
app.get('/webapp/remove/:id', function (req, res, next) {
    var WebApp = models('WebApp').model;
    var WebAppMetaData = models('WebAppMetaData').model;
    WebApp.find ({_id:req.params.id}).populate('meta').exec (function (err, doc) {
        if (!err && doc.length !== 0) {
            WebAppMetaData.find ({_id:doc[0].meta}, function (err, metadoc) {
                if (!err && metadoc.length !== 0) {
                    doc[0].delete (function (err, done) {
                        if (!err) {
                            metadoc[0].remove (function (err, done){
                                if(!err) {
                                    res.redirect('/webapp/list/?removed=' + req.params.id);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
app.get('/webapp/add/', function (req, res, next) {
    res.render ('manager/webapp-form', {webapp:new models('WebApp').model(), action:'add'});
    //res.sendFile(constants.systempublicpath + 'load-version-form.html');
});
app.post('/webapp/add/', function (req, res, next) {
    //vab.deploy(req.body.webapp, req.files.zip, constants.vhostspublicpath);
    var WebApp = models('WebApp').model;
    var WebAppMetaData = models('WebAppMetaData').model;
    WebApp.find ({webapp:req.body.webapp}, function (err, doc) {
        if (doc.length !== 0) {
            res.redirect ('/webapp/add/?already=1');
        }
        else {
            var waMetaData = new WebAppMetaData ();
            waMetaData.title = req.body["md-title"];
            waMetaData.description = req.body["md-description"];
            waMetaData.keywords = req.body["md-keywords"];
            waMetaData.save (function (err) {
                if (!err) {
                    var newWebApp = new WebApp();
                    newWebApp.webapp = req.body.webapp;
                    newWebApp.client = req.body.client;
                    newWebApp.campaignid = req.body["bd-cmpid"];
                    newWebApp.cpnid = req.body["bd-cpnid"];
                    newWebApp.meta = waMetaData;
                    newWebApp.save(function (err) {
                        if (!err) {
                            res.redirect('/webapp/add/?deployed=1');
                        }
                        else {
                            res.redirect('/webapp/add/?error=1');
                        }
                    });
                }
            });
        }
    });
});
module.exports = app;