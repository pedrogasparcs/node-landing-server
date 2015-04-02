#!/usr/bin/env node
var aslptemplator = require('./helpers/as-lp-templator');
var constants = require('./config/constants');
//
var models = require('./models');

/*
Clear Collections
 */
var WebApp = models('WebApp').model;
var q = WebApp.remove ({});
q.exec ();
console.log ("removed webapps");

var Request = models('Request').model;
var q = Request.remove ({});
q.exec ();
console.log ("removed requests");

var ServerUser = models('ServerUser').model;
var q = ServerUser.remove ({});
q.exec ();
console.log ("removed serverusers");

var remaxConfig = {
    webapp: 'www.remax-vivant.com',
    client: 'Remax',
    atdata: [{
        cpnid: '5e97d496158bfac8c5459fc1cf4474e0',
        campaignid: '3791'
    }],
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
    atdata: [{
        cpnid: '5e97d496158bfac8c5459fc1cf4474e0',
        campaignid: '3791'
    }],
    meta:[{
        title: 'Potato',
        description: 'Descrição Potato',
        iso: 'pt',
        keywords: 'Keywords Potato'
    }],
    versions:[
    ]};
var tomatoConfig = {
    webapp: 'www.tomato.com',
    client: 'Tomato',
    atdata: [{
        cpnid: '5e97d496158bfac8c5459fc1cf4474e0',
        campaignid: '3791'
    }],
    meta:[{
        title: 'Tomato',
        description: 'Descrição Tomato',
        iso: 'pt',
        keywords: 'Keywords Tomato'
    }],
    versions:[
    ]};



var dbInsertionsPipe = [];
var dbInsertionStep = 0;
function addToPipe (modelToSave_in) {
    dbInsertionsPipe.push (modelToSave_in);
}
function processPipe (callback_in) {
    dbInsertionStep = 0;
    var process = function () {
        console.log ("processing insertion: " + (dbInsertionStep + 1));
        dbInsertionsPipe[dbInsertionStep].save (function () {
            dbInsertionStep++;
            if (dbInsertionStep == dbInsertionsPipe.length) {
                callback_in ();
            }
            else {
                process ();
            }
        });
    }
    process ();
}

/*
Prepare and run insertions pipe
 */
addToPipe(new WebApp (remaxConfig));
addToPipe(new WebApp (potatoConfig));
addToPipe(new WebApp (tomatoConfig));
addToPipe(new ServerUser ({name: 'Pedro Gaspar', email: 'pedro.guspa@gmail.com'}));

processPipe (function () {
   process.exit (0);
});