var path = require('path');
module.exports = {
    systempublicpath: path.resolve(__dirname + '/../public/') + '/',
    vhostspublicpath: path.resolve(__dirname + '/../vhosts_public/') + '/',
    defaultdocument: 'index.html',
    uploadspath: path.resolve(__dirname + '/../uploads/') + '/',
    vabsdirectory: 'vabs/'
};