'use strict'

var mongoose = require('mongoose')
    , DestZone = mongoose.model('DestZone')
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

    return DestZone.findOneAndUpdate(condition, doc, {new: true}).exec();
}

exports.Create = function(req, res) {
    var destZone = new DestZone(req.body);
    destZone.company = req.session.company;

    return destZone.Save();
}

exports.Search = function(req, res) {
    var condition = {company: req.session.company};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };

    return DestZone.find(condition, fields, option).exec();

}


exports.Delete = function(req, res) {
    return DestZone.findOneAndRemove({
        _id: req.params.id, 
        company: req.session.company
    }).exec();
}