/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var models = require('./');

var WebAppAtData = models("WebAppAtData");
var WebAppMetaData = models("WebAppMetaData");
var WebAppVersion = models("WebAppVersion");

var schema = new Schema ({
    webapp: String,
    client: String,
    atdata: [WebAppAtData.schema],
    meta: [WebAppMetaData.schema],
    versions: [WebAppVersion.schema],
    active: {type: Boolean, default: true}
});

module.exports = {model: mongoose.model('WebApp', schema), schema: schema};