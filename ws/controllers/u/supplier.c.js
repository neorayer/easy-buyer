'use strict'

var mongoose = require('mongoose')
    , Supplier = mongoose.model('Supplier')
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
    set.modifyTime = Date.now();

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

    return Supplier.findOneAndUpdate(condition, doc).exec();
}

exports.Create = function(req, res) {
    var supplier = new Supplier(req.body);
    supplier.company = req.session.company;
    supplier.creater = {
        _id: req.session.user._id,
        name: req.session.user.name,
    }

    return supplier.Save();
}

exports.Search = function(req, res) {
    var condition = {company: req.session.company};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
    return Supplier.find(condition, fields, option).exec();
}


exports.Delete = function(req, res) {
    return  Supplier.findOneAndRemove({
        _id: req.params.id, 
        company: req.session.company
    }).exec();
}