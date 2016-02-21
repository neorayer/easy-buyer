'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
    ;
    
var DestZoneSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    destCode: String,
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone',
    }
});


DestZoneSchema.methods.Save = function() {
    var _this = this;
    return Q.ninvoke(_this, 'save')
            .then(function(destZones){
                return destZones[0]
            });
}

DestZoneSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var DestZone = mongoose.model('DestZone', DestZoneSchema);

