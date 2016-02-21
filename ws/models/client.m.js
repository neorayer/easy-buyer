'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    
    ;

var ClientSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    name: String,
    nickname: String,
    country: String,    
})

ClientSchema.methods.Delete = function() {
    return Q.ninvoke(this, 'remove');
}

ClientSchema.statics.DeleteMass = function(ids) {
    return Q.all(ids.map(function(id){
        return new Client({_id: id}).Delete();
    })).then(function(){
        return 'OK';
    });
}


ClientSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save')
    .then(function(datas){
        return datas[0];
    });
}

var Client = mongoose.model('Client', ClientSchema);
