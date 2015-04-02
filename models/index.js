/**
 * Created by pedro on 31/03/15.
 */
var dbconfig = require('../config/database');
var mongoose = require('mongoose');
mongoose.connect(dbconfig.mongoserver + dbconfig.mongodb);

module.exports = function(includeFile){
    return require('./'+includeFile);
};