/**
 * Created by pedro on 02/04/15.
 */
var constants = require('../config/constants');
var express = require('express');
var router = express.Router();
var models = require('../models');
var flash = require('connect-flash');

router.use (flash());

router.use (function (req, res, next) {
    if (!req.user) {
        res.redirect ('/auth/login');
    }
    else {
        next ();
    }
});
router.get('/', function (req, res, next) {
    res.redirect ('/manager/vab/add/');
});
router.get('/vab/add/', function (req, res, next) {
    var WebApp = models('WebApp').model;
    WebApp.find ({webapp:req.body.webapp}, function (err, docs) {
        if (docs.length !== 0) {
            console.log (docs);
            res.render ('manager/vab-form', {
                webapps: ['teste', 'teste1']
            });
        }
        else {
            res.redirect ('/manager/webapp/add/?nowebapps=1');
        }
    });
});
router.post('/vab/add/', function (req, res, next) {
    vab.deploy(req.body.webapp, req.files.zip, constants.vhostspublicpath);
    /*
     console.log (req.files);
     console.log (req.body);
     */
    res.redirect ('/manager/vab/add/?deployed=1');
});

router.get('/webapp/:id/vabs/list/:page?/:pageSize?', function (req, res, next) {
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
            res.redirect ('/manager/webapp/add/?nowebapps=1');
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

router.get('/webapp/list/:page?/:pageSize?', function (req, res, next) {
    var page = req.params.page?req.params.page:1;
    var pageSize = req.params.pageSize?req.params.pageSize:constants.listsDefaultSize;
    var WebApp = models('WebApp').model;
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
});
router.get('/webapp/edit/:id', function (req, res, next) {
    var WebApp = models('WebApp').model;
    WebApp.find ({_id:req.params.id}, function (err, doc) {
        if (doc.length !== 0){
            res.render ('manager/webapp-form', {webapp:doc[0], action:'edit'});
        }
        else {
            res.redirect ('/manager/webapp/add/?nowebappsonlist=1');
        }
    });
    //res.sendFile(constants.systempublicpath + 'load-version-form.html');
});
router.post('/webapp/edit/', function (req, res, next) {
    var WebApp = models('WebApp').model;
    WebApp.find ({_id:req.body.id}, function (err, doc) {
        if (doc.length !== 0) {
            var webappConf = doc[0].toObject();;
            webappConf.webapp = req.body.webapp;
            webappConf.client = req.body.client;
            webappConf.meta[0].title = req.body["md-title"];
            webappConf.meta[0].description = req.body["md-description"];
            webappConf.meta[0].keywords = req.body["md-keywords"];
            webappConf.atdata[0].cpnid = req.body["bd-cpnid"];
            webappConf.atdata[0].campaignid = req.body["bd-cmpid"];
            WebApp.update ({_id:req.body.id}, webappConf, function (err){
                if (!err) {
                    res.redirect ('/manager/webapp/list/?successEditing=1');
                }
                else {
                    res.redirect ('/manager/webapp/list/?errorEditing=1');
                }
            });
        }
    });
});
router.get('/webapp/remove/:id', function (req, res, next) {
    res.render ('manager/webapp-form');
    //res.sendFile(constants.systempublicpath + 'load-version-form.html');
});
router.get('/webapp/add/', function (req, res, next) {
    var WebApp = models('WebApp').model;
    var WebAppAtData = models('WebAppAtData').model;
    var WebAppMetaData = models('WebAppMetaData').model;
    var webappConf = new WebApp();
    res.render ('manager/webapp-form', {webapp:webappConf,action:'add'});
    //res.sendFile(constants.systempublicpath + 'load-version-form.html');
});
router.post('/webapp/add/', function (req, res, next) {
    //vab.deploy(req.body.webapp, req.files.zip, constants.vhostspublicpath);
    console.log (req.body);
    var WebApp = models('WebApp').model;
    WebApp.find ({webapp:req.body.webapp}, function (err, doc) {
        if (doc.length !== 0) {
            res.redirect ('/manager/webapp/add/?already=1');
        }
        else {
            var newWebApp = new WebApp ({
                webapp: req.body.webapp,
                client: req.body.client,
                active: true,
                versions: [],
                meta: [
                    {
                        title: req.body["md-title"],
                        description: req.body["md-description"],
                        keywords: req.body["md-keywords"],
                        iso: req.body["md-iso"]
                    }
                ],
                atdata: [
                    {
                        cpnid: req.body["bd-cpnid"],
                        campaignid: req.body["bd-cmpid"]
                    }
                ]
            });
            newWebApp.save (function (err) {
                if (!err) {
                    res.redirect ('/manager/webapp/add/?deployed=1');
                }
                else {
                    res.redirect ('/manager/webapp/add/?error=1');
                }
            });
        }
    });
});
module.exports = router;