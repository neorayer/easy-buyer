'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    
    ;

var BankaccSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    country: String,
    bankName: String,
    swift: String,
    accName: String,
    accNumber: String,
    address: String,
    city: String,
    state: String,
    postcode: String,
    description: String,
});

BankaccSchema.methods.Delete = function() {
    return Q.ninvoke(this, 'remove');
}

BankaccSchema.statics.DeleteMass = function(ids) {
    return Q.all(ids.map(function(id){
        return new Bankacc({_id: id}).Delete();
    })).then(function(){
        return 'OK';
    });
}


BankaccSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save')
    .then(function(datas){
        return datas[0];
    });
}

var Bankacc = mongoose.model('Bankacc', BankaccSchema);
