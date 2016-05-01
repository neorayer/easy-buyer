'use strict'

var mongoose = require('mongoose')
    , Message = mongoose.model('Message')
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
            return Message.SetPrimary(_id);
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

        return Message.findOneAndUpdate(condition, doc).exec();
    }

    return Q().then(SetPrimaryIfNeed)
              .then(CommonUpdate);
}

exports.Create = function(req, res) {
    // one copy to receiver in inbox
    {
        var message = new Message(req.body);
        message.owner = message.to._id;
        message.company = message.to.company;
        message.mbox = 'inbox';
        message.Save();
    }
    {
    // on copy to sender in sent
        var message = new Message(req.body);
        message.owner = req.session.consumer._id;
        message.mbox = 'sent';
        return message.Save();
    }

}

exports.Read = function(req, res) {
    return Message.findOne({_id: req.params.id}).lean().exec().then(function(data){
        if (!data)
            throw new Error('no found the cart');
        return data;
    })
}


exports.Search = function(req, res) {
    var condition = {user: req.session.consumer._id};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
   // return Q.delay(2000).then(function(){
        return Message.find(condition, fields, option).exec();
    //});
}

exports.Delete = function(req, res) {
    return DBTools.DeleteModel(Message, {
        _id: req.params.id, 
    });
}