'use strict'

/**
 psp = product-supplier-price
 产品的供应商报价记录
**/

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
    ;
    
var PspSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'supplier',
    },
    content: String,
    updateTime: Date,
});


PspSchema.methods.Save = function() {
    var _this = this;
    _this.updateTime = Date.now();
    return Q.ninvoke(_this, 'save')
            .then(function(datas){
                return datas[0]
            });
}

PspSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var Psp = mongoose.model('Psp', PspSchema);

