'use strict'

var mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Q = require('q')
    
    , _ = require('lodash')
    ;


exports.Search = function(req, res) {
    var condition = {company: req.query.company, isPubContact: req.query.isPubContact};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
    return User.find(condition, fields, option).exec().then(function(users){
        users.forEach(function(user){
            delete user.password;
        });
        return users;
    });
}
