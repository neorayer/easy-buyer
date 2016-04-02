'use strict'

var mongoose = require('mongoose')
    , Bankacc = mongoose.model('Bankacc')
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

    return Bankacc.findOneAndUpdate(condition, doc, {new: true}).exec();
}

exports.Create = function(req, res) {
    var bankacc = new Bankacc(req.body);
    bankacc.company = req.session.company;

    return bankacc.Save();
}

exports.Search = function(req, res) {
    var condition = {company: req.session.company};
    _.extend(condition, req.query);
    _
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
    return Bankacc.find(condition, fields, option).exec();
}


exports.Delete = function(req, res) {
    return Bankacc.findOneAndRemove({
        _id: req.params.id, 
        company: req.session.company
    }).exec();

}