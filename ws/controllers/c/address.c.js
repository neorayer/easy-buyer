'use strict'

var mongoose = require('mongoose')
    , Address = mongoose.model('Address')
    , User = mongoose.model('User')
    , Q = require('q')
    
    , _ = require('lodash')
    , ak    = require('../../../../zjs/army-knife.js')
    ;


exports.Save = function(req, res) {
    if (req.body._id)
        return exports.Update(req, res);

    return exports.Create(req, res);
}

exports.Update = function(req, res) {
    var set = _.extend({}, req.body);
    var _id = set._id;

    function SetPrimaryIfNeed() {
        if (set.isPrimary) {
            delete set.isPrimary;
            return Address.SetPrimary(_id);
        }
    }

    function CommonUpdate() {
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

        return Address.findOneAndUpdate(condition, doc).exec();
    }

    return Q().then(SetPrimaryIfNeed)
              .then(CommonUpdate);
}

exports.Create = function(req, res) {
    var address = new Address(req.body);
    address.user = req.session.consumer._id;

    return address.Save();
}

exports.Read = function(req, res) {
    return Address.findOne({_id: req.params.id}).lean().exec().then(function(data){
        if (!data)
            throw new Error('no found the cart');
        return data;
    })
}


exports.Search = function(req, res) {
    // visitor是否登录了？
    if (!req.session.consumer) {
        return [];
    }

    var condition = {user: req.session.consumer._id};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
   // return Q.delay(2000).then(function(){
        return Address.find(condition, fields, option).exec();
    //});
}

exports.Delete = function(req, res) {
    return Address.findOneAndRemove({
        _id: req.params.id, 
        user: req.session.consumer._id,
    }).exec();
}