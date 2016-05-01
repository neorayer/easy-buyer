'use strict'

var mongoose = require('mongoose')
    , Contact = mongoose.model('Contact')
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

    set.lastUpdated = Date.now();

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

    return Contact.findOneAndUpdate(condition, doc).exec();
}

exports.Create = function(req, res) {
    var contact = new Contact(req.body);
    var userId = req.body.user;

    var rtn;
    return contact.Save().then(function(con){
        rtn = con;
        return User.findOneAndUpdate({_id: userId}, {
            $set: {
                contact: con._id,
                fullname: con.fullname,
            }
        }).exec();
    }).then(function(){
        return rtn;
    });
}

exports.Read = function(req, res) {
    return Contact.findOne({_id: req.params.id}).lean().exec().then(function(data){
        if (!data)
            throw new Error('no found the cart');
        return data;
    })
}


exports.Delete = function(req, res) {
    return DBTools.DeleteModel(Contact, {
        _id: req.params.id, 
    });
}