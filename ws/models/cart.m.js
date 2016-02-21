'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    
    ;

var CartSchema = mongoose.Schema({
    items: [Schema.Types.Mixed],
    lastUpdated: Date,
})

CartSchema.methods.Delete = function() {
    return Q.ninvoke(this, 'remove');
}

CartSchema.statics.DeleteMass = function(ids) {
    return Q.all(ids.map(function(id){
        return new Cart({_id: id}).Delete();
    })).then(function(){
        return 'OK';
    });
}

CartSchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});

CartSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save')
    .then(function(datas){
        return datas[0];
    });
}

var Cart = mongoose.model('Cart', CartSchema);
