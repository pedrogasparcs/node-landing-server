/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var models = require('./');

var schema = new Schema ({
    cpnid: {type: String, required: true},
    campaignid: {type: String, required: true}
});

module.exports = {model: mongoose.model('WebAppAtData', schema), schema: schema};