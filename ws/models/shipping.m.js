'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    
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
    return Q.ninvoke(this, 'remove');
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

var Shipping = mongoose.model('Shipping', ShippingSchema);
