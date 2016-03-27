'use strict'

var fs = require('fs')
    , path = require('path')
    ;


module.exports = {
    dbname: 'rhinoceros2',
    httpPort: 80,
    staticPaths: ['bower_components', 'ui-user', 'ui-admin', 'zjs', 'lib', 'theme'],

}

function mkdirIfNotExists(path) {
    if (!fs.existsSync(path))
        fs.mkdirSync(path);
}

// Note: its sync method
module.exports.init = function() {
}
