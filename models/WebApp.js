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
var WebAppVersion = models("WebAppVersion");

var schema = new Schema ({
    webapp: {type: String, default: ''},
    client: {type: String, default: ''},
    campaignid: {type: String, default: ''},
    cpnid: {type: Number, default: 0},
    meta: {
        type: Schema.Types.ObjectId,
        ref: 'WebAppMetaData',
        default: new WebAppMetaData.model ()
    },
    versions: [ {
        type: Schema.Types.ObjectId,
        ref: 'WebAppVersion'
    }],
    active: {type: Boolean, default: true}
});

schema.plugin(mongoosePaginate);
schema.plugin(mongooseTimestamp);
schema.plugin(mongooseSoftDelete, { deletedAt : true, deletedBy : true });

module.exports = {
    model: mongoose.model('WebApp', schema),
    schema: schema
};