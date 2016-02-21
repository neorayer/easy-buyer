'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    
    ;

var PaypalSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    name: String,
    username: String,
    password: String,
    token: String,
});

PaypalSchema.methods.Delete = function() {
    return Q.ninvoke(this, 'remove');
}

PaypalSchema.statics.DeleteMass = function(ids) {
    return Q.all(ids.map(function(id){
        return new Paypal({_id: id}).Delete();
    })).then(function(){
        return 'OK';
    });
}


PaypalSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save')
    .then(function(datas){
        return datas[0];
    });
}

var Paypal = mongoose.model('Paypal', PaypalSchema);
