/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var models = require('./');

var ConfigMetaData = models("ConfigMetaData");

var schema = new Schema ({
    path: String,
    meta: [ConfigMetaData.schema],
    iso: String,
    keywords: String
});

module.exports = {model: mongoose.model('ConfigVersion', schema), schema: schema};