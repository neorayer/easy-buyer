'use strict'

var mongoose = require('mongoose')
    , Cart = mongoose.model('Cart')
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

    return Cart.findOneAndUpdate(condition, doc).exec();
}

exports.Create = function(req, res) {
    var cart = new Cart(req.body);

    return cart.Save();
}

exports.Search = function(req, res) {
    var condition = {};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
   // return Q.delay(2000).then(function(){
        return Cart.find(condition, fields, option).exec();
    //});
}

exports.Read = function(req, res) {
    return Cart.findOne({_id: req.params.id}).lean().exec().then(function(data){
        if (!data)
            throw new Error('no found the cart');
        return data;
    })
}


exports.Delete = function(req, res) {
    return DBTools.DeleteModel(Cart, {
        _id: req.params.id, 
    });
}