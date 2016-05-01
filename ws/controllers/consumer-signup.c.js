'use strict'

var mongoose    = require('mongoose')
    , _         = require('lodash')
    , ak    = require('../../../zjs/army-knife.js')
    , Q         = require('q')

    , Consumer      = mongoose.model('Consumer')
    ;


exports.Save = function(req, res) {
    var consumer = new Consumer(req.body);

    return consumer.Save();
}

