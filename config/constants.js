var path = require('path');
module.exports = {
    systempublicpath: path.resolve(__dirname + '/../public/') + '/',
    vhostspublicpath: path.resolve(__dirname + '/../vhosts_public/') + '/',
    defaultdocument: 'index.html',
    uploadspath: path.resolve(__dirname + '/../uploads/') + '/',
    vabsdirectory: 'vabs/',
    listsDefaultSize: 10,
    listsAvailableSizes: [1, 5, 10, 25, 50, 100]
};