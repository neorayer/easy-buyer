'use strict'

var mongoose    = require('mongoose')
    , _         = require('lodash')
    , Q         = require('q')
    , ak        = require('../../../zjs/army-knife.js')
    , Consumer      = mongoose.model('Consumer')
    ;


exports.Save = function(req, res) {
    var params = {
        email: req.body.email,
        password: req.body.password,
    }

    res.cookie('lastLoginConsumer', params, {maxAge: 365 * 24 * 60 * 60 * 1000});

    var Auth = function() {
        return Consumer.Auth(params).then(function(data) {
            ak.PurifyData(data.consumer);
            data.consumer.company = data.company;
            req.session.consumer = data.consumer;
            req.session.consumer.password = '******';
            if (data.company)
                req.session.company = data.company._id;
            return data.consumer;
        });
    }

    var Delay = function() {
        console.log("delay 5000 ms for debugging.")
        var deferred = Q.defer();
        setTimeout(deferred.resolve, 5000);
        return deferred.promise;
    }

    return Q()
            //.then(Delay)
            .then(Auth);
}

exports.Delete = function(req, res) {
    delete req.session.consumer;
    return Q({});
}

