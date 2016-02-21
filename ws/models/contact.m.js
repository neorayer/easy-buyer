'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    
    ;

var ContactSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    fullname: String,
    importance: Number,
    type: String,
    organization: String,
    responsibility: String,
    department: String,
    headship: String,
    telephone: String,
    email: String,
    mobile: String,
    fax: String,
    wangwang: String,
    postcode: String,
    postAddress: String,
    comment: String,
    country: String,
});

ContactSchema.methods.Delete = function() {
    return Q.ninvoke(this, 'remove');
}

ContactSchema.statics.DeleteMass = function(ids) {
    return Q.all(ids.map(function(id){
        return new Contact({_id: id}).Delete();
    })).then(function(){
        return 'OK';
    });
}


ContactSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save')
    .then(function(datas){
        return datas[0];
    });
}

var Contact = mongoose.model('Contact', ContactSchema);
