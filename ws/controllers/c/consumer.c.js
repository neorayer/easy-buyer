'use strict'

var mongoose = require('mongoose')
    , Consumer = mongoose.model('Consumer')
    , Q = require('q')
    
    , _ = require('lodash')
    ;


exports.Save = function(req, res) {
    if (req.body._id)
        return exports.Update(req, res);

    return exports.Create(req, res);
}

function updatePassword(req, res) {
    var uid = req.body._id;
    if (uid !== req.session.consumer._id)
        throw 'seurity checking error';

    return Consumer.findOne({_id: uid}).exec().then(function(consumer) {
        return consumer.ChangePassword(req.body.oldpass, req.body.newpass);
    });
}

exports.Update = function(req, res) {
    // change password
    if (req.body.newpass)
       return updatePassword(req, res); 

    var set = _.extend({}, req.body);
//    var _id = set._id;
    //这个是特殊的，consumer._id只能从session里取；安全性考虑。
    var _id = req.session.consumer._id;
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

    return Consumer.findOneAndUpdate(condition, doc).exec();
}


exports.Search = function(req, res) {
    var condition = {company: req.query.company, isPubContact: req.query.isPubContact};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
    return Consumer.find(condition, fields, option).exec().then(function(consumers){
        consumers.forEach(function(consumer){
            delete consumer.password;
        });
        return consumers;
    });
}

exports.Read = function(req, res) {
    return Consumer.findOne({_id: req.params.id}).lean().exec().then(function(data){
        if (!data)
            throw new Error('no found the cart');
        return data;
    })
}


exports.Delete = function(req, res) {
    return DBTools.DeleteModel(Consumer, {
        _id: req.params.id, 
    });
}