'use strict'

var mongoose    = require('mongoose')
    , _         = require('lodash')
    , Q         = require('q')

    , Consumer      = mongoose.model('Consumer')
    ;


exports.Save = function(req, res) {
    var consumer = new Consumer(req.body);

    return consumer.Save();
}

