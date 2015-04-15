/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    mongooseTimestamp = require('mongoose-timestamp'),
    mongooseSoftDelete = require('mongoose-delete'),
    models = require('./');

var WebAppMetaData = models("WebAppMetaData");

var schema = new Schema ({
    path: {type: String, default: ''},
    meta: {
        type: Schema.Types.ObjectId,
        ref: 'WebAppMetaData',
        default: new WebAppMetaData.model ()
    },
    active: {type: Boolean, default: true}
});

schema.plugin(mongoosePaginate);
schema.plugin(mongooseTimestamp);
schema.plugin(mongooseSoftDelete, { deletedAt : true, deletedBy : true });

module.exports = {model: mongoose.model('WebAppVersion', schema), schema: schema};