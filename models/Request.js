/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var models = require('./');

var schema = new Schema ({ name: String });

module.exports = {model: mongoose.model('Request', schema), schema: schema};;