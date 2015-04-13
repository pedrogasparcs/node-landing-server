/**
 * Created by pedro on 02/04/15.
 */
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
    res.redirect ('/manager/add-vab');
});
router.get('/add-vab', function (req, res, next) {
    var WebApp = models('WebApp').model;
    WebApp.find ({webapp:req.body.webapp}, function (err, docs) {
        if (docs.length !== 0) {
            console.log (docs);
            res.render ('manager/vab-form', {
                webapps: ['teste', 'teste1']
            });
        }
        else {
            res.redirect ('/manager/add-webapp?nowebapps=1');
        }
    });
});
router.post('/add-vab', function (req, res, next) {
    vab.deploy(req.body.webapp, req.files.zip, constants.vhostspublicpath);
    /*
     console.log (req.files);
     console.log (req.body);
     */
    res.redirect ('/manager/add-vab?deployed=1');
});
router.get('/add-webapp', function (req, res, next) {
    res.render ('manager/webapp-form');
    //res.sendFile(constants.systempublicpath + 'load-version-form.html');
});
router.post('/add-webapp', function (req, res, next) {
    //vab.deploy(req.body.webapp, req.files.zip, constants.vhostspublicpath);
    console.log (req.body);
    var WebApp = models('WebApp').model;
    WebApp.find ({webapp:req.body.webapp}, function (err, doc) {
        if (doc.length !== 0) {
            res.redirect ('/manager/add-webapp?already=1');
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
                    res.redirect ('/manager/add-webapp?deployed=1');
                }
                else {
                    res.redirect ('/manager/add-webapp?error=1');
                }
            });
        }
    });
});
module.exports = router;