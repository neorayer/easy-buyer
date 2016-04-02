'use strict'

var mongoose = require('mongoose')
    , SupProduct = mongoose.model('SupProduct')
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
    delete set.company;

    if (req.body.isUpdatePriceTime)
        set.lastPriceTime = Date.now();

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

    var condition = {_id: _id, company: req.session.company};

    return SupProduct.findOneAndUpdate(condition, doc, {new: true}).exec();
}

exports.Create = function(req, res) {
    var supProduct = new SupProduct(req.body);
    supProduct.company = req.session.company;
    supProduct.creater = {
        _id: req.session.user._id,
        name: req.session.user.name,
    }

    return supProduct.Save();
}

exports.Search = function(req, res) {
    var condition = {company: req.session.company};
    if (req.query.supplier)
        condition.supplier = req.query.supplier;
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
    return SupProduct.find(condition, fields, option).exec();
}


exports.Delete = function(req, res) {
    return  SupProduct.findOneAndRemove({
        _id: req.params.id, 
        company: req.session.company
    }).exec();
}