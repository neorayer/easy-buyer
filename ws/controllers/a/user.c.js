'use strict'

var mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Q = require('q')
    , _ = require('lodash')
    ;


exports.Save = function(req, res) {
    if (req.body._id)
        return exports.Update(req, res);

    return exports.Create(req, res);
}

exports.Update = function(req, res) {
    var set = _.extend({}, req.body);
    var _id = set._id;
    delete set._id;

    var unset;
    if (set._unset) {
        set.unset.forEach(function(item) {
            if (!unset)
                unset = {};
            unset[item] = 1;
        });
    }

    var doc = {};
    if (set)
        doc.$set = set;
    if (unset)
        doc.$unset = unset;

    delete set._unset;

    var condition = {_id: _id};

    return User.findOneAndUpdate(condition, doc).exec();
}

exports.Create = function(req, res) {
    var user = new User(req.body);

    return user.Save();
}

exports.Search = function(req, res) {
    var condition = {};

    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
    return User.find(condition, fields, option).populate('company').exec();
}


exports.Delete = function(req, res) {
    return new User({
        _id: req.params.id, 
    }).Delete();
}