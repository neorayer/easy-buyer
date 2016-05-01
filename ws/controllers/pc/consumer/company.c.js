'use strict'

var mongoose = require('mongoose')
    , Q = require('q')
    , Company = mongoose.model('Company')
    , _ = require('lodash')
    ;



exports.GetRender_1 = function(req, res) {
    var data = {};
    var user = req.session.consumer;
    if (user){
        data.session_user = user;
    }

    return Company.findOne({_id: req.params.arg1}).lean().exec().then(function(company) {
        if (!company)
            throw new Error('公司不存在');
        data.company = company;
        res.render('ui-consumer/pc/tpl/company.pg.html', data);
    });
}

