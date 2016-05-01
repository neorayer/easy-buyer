'use strict'

var mongoose = require('mongoose')
    , Product = mongoose.model('Product')
    , Q = require('q')
    
    , _ = require('lodash')
    ;


exports.Search = function(req, res) {
    var condition = {company: req.query.company};
    var keyword = req.query.keyword;
    if (keyword)
        condition.$text = {$search: keyword};
    var fields = null;
    var option = {
        sort: {created: 1}, 
        lean: true,
    };
   // return Q.delay(2000).then(function(){
        return Product.find(condition, fields, option).exec();
    //});
}

exports.Read = function(req, res) {
    return Product.findOne({_id: req.params.id}).lean().exec().then(function(product){
        if (!product)
            throw new Error('no found the product');
        return product;
    })
}
