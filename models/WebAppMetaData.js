/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongooseTimestamp = require('mongoose-timestamp'),
    models = require('./');

var schema = new Schema ({
    title: {type: String, default: ''},
    description: {type: String, default: ''},
    iso: {type: String, default: ''},
    keywords: {type: String, default: ''}
});

schema.plugin(mongooseTimestamp);

module.exports = {model: mongoose.model('WebAppMetaData', schema), schema: schema};