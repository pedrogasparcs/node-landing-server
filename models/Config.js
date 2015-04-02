/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var models = require('./');

var ConfigMetaData = models("ConfigMetaData");
var ConfigVersion = models("ConfigVersion");

var schema = new Schema ({
    webapp: String,
    client: String,
    meta: [ConfigMetaData.schema],
    versions: [ConfigVersion.schema]
});

module.exports = {model: mongoose.model('Config', schema), schema: schema};