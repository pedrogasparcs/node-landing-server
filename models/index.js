/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/as-lp-server');

module.exports = function(includeFile){
    return require('./'+includeFile);
};