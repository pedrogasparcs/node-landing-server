/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose');
var models = require('.');

var schema = new Schema ({
    webapp: String,
    client: String,
    meta: Object,
    versions: Array
});

module.exports = {model: mongoose.model('Config', schema), schema: schema};