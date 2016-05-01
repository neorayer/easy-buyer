'use strict'

var mongoose = require('mongoose')
    , DestZone = mongoose.model('DestZone')
    , Q = require('q')
    
    , _ = require('lodash')
    , ak    = require('../../../../zjs/army-knife.js')
    ;


exports.Search = function(req, res) {
    var condition = {company: req.query.company};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };

    return DestZone.find(condition, fields, option).exec();
}

