'use strict'

var mongoose = require('mongoose')
    , Q = require('q')
    
    , _ = require('lodash')
    , Company = mongoose.model('Company')
    ;


exports.GetRender = function(req, res) {
    var data = {
        companies: [],
    };

    var LoadCompanies = function() {
        var condition = {};
        var fields = null;
        var option = {
            sort: {created: 1}, 
            lean: true,
        };
        return Company.find(condition, fields, option).exec().then(function(companies){
            data.companies = companies || [];
        });
    }

    var Render = function() {
        res.render('ui-consumer/pc/tpl/mall.pg.html', data);
    }

    return Q().then(LoadCompanies)
              .then(Render);
}

