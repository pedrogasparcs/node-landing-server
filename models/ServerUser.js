/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var models = require('./');

var schema = new Schema ({
    name: String,
    email: String,
    active: {type: Boolean, default: true},
    googleprofile: Object
});

module.exports = {model: mongoose.model('ServerUser', schema), schema: schema};