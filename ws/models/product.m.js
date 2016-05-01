'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
    , ak = require('../../zjs/army-knife.js')
   ;
    
var ProductSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    name: String,
    chemicalName: String,
    synonyms: String,
    casNo: String,
    ecNo: String,
    moleFormula: String, // Molecular formula,
    moleWeight: String, // Molemcular Weight,
    moleStructurePicUrl: String, 
    inChl: String, 
    description: String, 
    skus: [
        {
            name: String,
            weight: Number,
            prices: [{
                priceType: String,
                value: Number,
            }],
        }
    ],
    pictures: [Schema.Types.Mixed],
    documents: [Schema.Types.Mixed],
        // {
        //     name: String,
        //     type: String,
        //     ext: String,
        //     size: Number,
        //     docClass: String,
        // }
    status: {
        type: String,  // 'raw', 'accepted', 'rejected', 
        default: 'raw',
    },
    creater: {
        _id: String,
        name: String,
    },
});


ProductSchema.methods.Save = function() {
    var _this = this;
    var CheckCasNo = function() {
        return Product.findOne({casNo: _this.casNo}).exec()
               .then(function(p){
            if (p)
                ak.ThrowError('casNo', 'CAS No已被注册。');
        });
    }
    var SaveProduct = function() {
        return Q.ninvoke(_this, 'save')
                .then(function(products){
                    return products[0]
        });
    }

    return Q.when()
            .then(CheckCasNo)
            .then(SaveProduct);
}

ProductSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var Product = mongoose.model('Product', ProductSchema);

