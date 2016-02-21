'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
    , ak = require('../../zjs/army-knife.js')
   ;
    
var SupProductSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    prices: [
        {
            minWeight: Number,
            maxWeight: Number,
            unitPrice: Number,
        }
    ],
    labsheets: [
        {
            name: String,
            url: String,
        }
    ],
    lastPriceTime: Date,
    status: {
        type: String,  // 'raw', 'accepted', 'rejected', 
        default: 'raw',
    },
    creater: {
        _id: String,
        name: String,
    },
});


SupProductSchema.methods.Save = function() {
    var _this = this;
    var SaveSupProduct = function() {
        return Q.ninvoke(_this, 'save')
                .then(function(products){
                    return products[0]
        });
    }

    return Q.when()
            .then(SaveSupProduct);
}

SupProductSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var SupProduct = mongoose.model('SupProduct', SupProductSchema);

