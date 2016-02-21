'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
    ;
    
var ZoneSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    name: String,
});


ZoneSchema.methods.Save = function() {
    var _this = this;
    return Q.ninvoke(_this, 'save')
            .then(function(zones){
                return zones[0]
            });
}

ZoneSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var Zone = mongoose.model('Zone', ZoneSchema);

