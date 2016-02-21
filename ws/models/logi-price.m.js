'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
    ;
    
var LogiPriceSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    minWeight: Number,
    maxWeight: Number,
    priceType: String,  // 'total' or 'kg' 
    priceSet: Object, //{ zone1: 123, zon2: 2343, zone3: 3434}
});


LogiPriceSchema.methods.Save = function() {
    var _this = this;
    return Q.ninvoke(_this, 'save')
            .then(function(destZones){
                return destZones[0]
            });
}

LogiPriceSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var LogiPrice = mongoose.model('LogiPrice', LogiPriceSchema);

