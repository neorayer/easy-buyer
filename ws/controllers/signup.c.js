'use strict'

var mongoose    = require('mongoose')
    , _         = require('lodash')
    , ak        = require('../../zjs/army-knife')
    , Q         = require('q')

    , Company = mongoose.model('Company')
    , User      = mongoose.model('User')
    ;


exports.Save = function(req, res) {
    var company = new Company(req.body);

    return company.Save();
}

