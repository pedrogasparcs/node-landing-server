/**
 * Created by pedro on 31/03/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    models = require('./');

var WebAppAtData = models("WebAppAtData");
var WebAppMetaData = models("WebAppMetaData");
var WebAppVersion = models("WebAppVersion");

var schema = new Schema ({
    webapp: String,
    client: String,
    atdata: {
        type: Array,
        default: [new WebAppAtData.model ()]
    },
    meta: {
        type: Array,
        default: [new WebAppMetaData.model ()]
    },
    versions: [WebAppVersion.schema],
    active: {type: Boolean, default: true}
});

schema.plugin(mongoosePaginate);

module.exports = {
    model: mongoose.model('WebApp', schema),
    schema: schema
};