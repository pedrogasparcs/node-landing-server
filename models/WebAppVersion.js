/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var models = require('./');

var WebAppMetaData = models("WebAppMetaData");

var schema = new Schema ({
    path: String,
    meta: [WebAppMetaData.schema],
    iso: String,
    keywords: String,
    active: {type: Boolean, default: true}
});

module.exports = {model: mongoose.model('WebAppVersion', schema), schema: schema};