'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    , ak = require('../../zjs/army-knife.js')
    , Company = mongoose.model('Company')
    , DestZone = mongoose.model('DestZone')
    , LogiPrice = mongoose.model('LogiPrice')
    , ShippingCalculator = require('../services/shipping-calculator.js')
    ;

var ShippingSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    name: String,
    type: String,
    brand: String,
});

ShippingSchema.methods.Delete = function() {
    var Zone = mongoose.model('Zone');

    var _this = this;
    var RemoveZones = function() {
        Zone.find({shipping:_this._id}).exec().then(function(zones) {
            return Q.all(zones.map(function(zone){
                return zone.Delete();
            }));
        })
    }
    var RemoveShipping = function() {
        return Q.ninvoke(_this, 'remove');
    }

    return Q.when()
            .then(RemoveZones)
            .then(RemoveShipping);
}

ShippingSchema.statics.DeleteMass = function(ids) {
    return Q.all(ids.map(function(id){
        return new Shipping({_id: id}).Delete();
    })).then(function(){
        return 'OK';
    });
}

ShippingSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save')
    .then(function(datas){
        return datas[0];
    });
}

// ShippingSchema.methods.LoadZones = function() {
//     var _this = this;
//     return Zone.find({shipping:_this._id}).exec().then(function(zones) {
//         _this.zones = zones;
//     });
// }

// ShippingSchema.methods.LoadDestZones = function() {
//     var _this = this;
//     return Q.all(_this.zones.map(function(zone) {
//         return zone.LoadDestZones();
//     }));
// }

ShippingSchema.methods.CalcFee = function(params) {
    var _this = this;

    var zones;
    var destZones;
    var logiPrices;

    var LoadLogiPrice = function() {
        return LogiPrice.find({shipping:_this._id}).exec().then(function(lps) {
            logiPrices = lps;
        });
    }

    // get the zone from dest
    var destZone = null;
    var GetDestZone = function() {
        DestZone.findOne({
            company: params.company,
            shipping: _this._id,
            destCode: params.destCode,
        }).exec().then(function(dz) {
            destZone = dz;
        })
    }

    var CalcFee = function() {
        return {
            shipping: _this._id,
            value: ShippingCalculator.calc(_this.type, logiPrices, params.weight, params.volume, destZone),
        };
    }

    return Q.when()
            .then(GetDestZone)
            .then(LoadLogiPrice)
            .then(CalcFee);
}

var Shipping = mongoose.model('Shipping', ShippingSchema);
