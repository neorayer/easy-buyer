'use strict'

var mongoose = require('mongoose')
    , Q = require('q')
    , _ = require('lodash')
    , Shipping = mongoose.model('Shipping')
//    , ShippingCalculator = require('../../services/shipping-calculator.js')
    ;


exports.Search = function(req, res) {
    var formCalc = {
        weight: req.query.weight,
        volume: req.query.volume,
        destCode: req.query.destCode,
        company: req.session.company,
    };

    var shippings = [];

    var LoadShippings = function() {
        return Shipping.find({company: req.session.company}).exec()
            .then(function(shs) {
                shippings = shs;
            });
    }

    var CalcShippings = function() {
        var promises = shippings.map(function(shipping) {
            return shipping.CalcFee(formCalc);
        });
        return Q.allSettled(promises)
                .then(function(results) {
                    console.log(results)
                    return results.map(res => res.value);
                });
    }

    return Q.when()
            .then(LoadShippings)
            .then(CalcShippings);
}

