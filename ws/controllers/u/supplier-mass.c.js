'use strict'

var mongoose = require('mongoose')
    , Supplier = mongoose.model('Supplier')
    , Q = require('q')
    
    , _ = require('lodash')
    ;


exports.Save = function(req, res) {
    var method = req.body.method;
    var ids = req.body.ids;
    switch(method) {
        case 'Delete':
            return Supplier.DeleteMass(ids);
        break;
    }
}

