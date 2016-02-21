'use strict'

var mongoose    = require('mongoose')
    , _         = require('lodash')
    , ak        = require('../../zjs/army-knife')
    , Q         = require('q')

    , User      = mongoose.model('User')
    ;


exports.Save = function(req, res) {
    return User.Auth(req.body).then(function(data){
        data.user.password = '*';
        req.session.user = data.user;
        req.session.company = data.company._id;
        return data;
    });
}


exports.Delete = function(req, res) {
    delete req.session.user;
    delete req.session.company;
}


