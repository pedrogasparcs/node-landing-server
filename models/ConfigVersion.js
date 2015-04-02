/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose');
var models = require('.');

var schema = new Schema ({
    title: String,
    description: String,
    iso: String,
    keywords: String
});

module.exports = {model: mongoose.model('ConfigMetaData', schema), schema: schema};