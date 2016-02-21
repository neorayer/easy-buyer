'use strict'

var mongoose    = require('mongoose')
    , _         = require('lodash')
    , Q         = require('q')

    , User      = mongoose.model('User')
    ;


exports.GetRender = function(req, res) {
    var data = _.clone(req.query) || {};
    var render = function() {
        res.render('ui-user/pc/m/portal/signin.pg.html', {data:data});
    }
    return Q()
            .then(render);
}


