'use strict'

var mongoose    = require('mongoose')
    , _         = require('lodash')
    , ak        = require('../../zjs/army-knife')
    , Q         = require('q')

    , Admin      = mongoose.model('Admin')
    ;


exports.Save = function(req, res) {
    return Admin.Auth({
        username:req.body.username,
        password: req.body.password,
    }).then(function(data){
        data.admin.password = '*';
        req.session.admin = data.admin;
        return data;
    });
}


exports.Delete = function(req, res) {
    delete req.session.admin;
}


