'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    
    ;

var AddressSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    country: String,
    state: String,
    suburb: String,
    postcode: String,
    streetLine1: String,
    streetLine2: String,
    phone: String,
    isPrimary: Boolean,
    receiver : {
        first: String,
        mid: String,
        last: String,
    }
});

//将某个addr设置为该用户的primary address
AddressSchema.statics.SetPrimary = function(id) {
    var primaryAddr;

    return Address.findOne({_id: id}).exec().then(function(addr){
        if (!addr)
            throw new Error('No such address with id ' + id);
        //没有user项，则忽略
        if (!addr.user) 
            return addr;

        return Address.update({user: addr.user}, {$set: {isPrimary: false}}, { multi: true }).exec().then(function(){
           return Address.findOneAndUpdate({_id: addr._id}, {$set: {isPrimary: true}}).exec();
        })
    })

}

AddressSchema.methods.Delete = function() {
    return Q.ninvoke(this, 'remove');
}

AddressSchema.statics.DeleteMass = function(ids) {
    return Q.all(ids.map(function(id){
        return new Address({_id: id}).Delete();
    })).then(function(){
        return 'OK';
    });
}

AddressSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save')
    .then(function(datas){
        return datas[0];
    });
}

var Address = mongoose.model('Address', AddressSchema);
