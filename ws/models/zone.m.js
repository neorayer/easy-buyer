'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
    , DestZone = mongoose.model('DestZone')
    , LogiPrice = mongoose.model('LogiPrice')
    ;
    
var ZoneSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    shipping: {
        type: Schema.Types.ObjectId,
        ref: 'Shipping',
    },
    name: String,
});


ZoneSchema.methods.Save = function() {
    var _this = this;
    return Q.ninvoke(_this, 'save')
            .then(function(zones){
                return zones[0]
            });
}

ZoneSchema.methods.Delete = function() {
    var _this = this;

    var RemoveDestZone = function() {
        return Q.ninvoke(DestZone, 'remove', {zone: _this._id});
    }

    var RemoveLogiPrice = function() {
        return Q.ninvoke(LogiPrice, 'remove', {zone: _this._id});
    }

    var RemoveZone = function() {
        return Q.ninvoke(_this, 'remove');
    }

    return Q.when()
            .then(RemoveDestZone)
            .then(RemoveLogiPrice)
            .then(RemoveZone);
}

var Zone = mongoose.model('Zone', ZoneSchema);

