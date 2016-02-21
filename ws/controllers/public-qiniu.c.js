'use strict'

var mongoose    = require('mongoose')
    , _         = require('lodash')
    , qiniu = require('qiniu')
    ;

qiniu.conf.ACCESS_KEY = 'jHEZdfL3Ews-h-xjzj0pO5JROUBMXLUF8y315pYT';
qiniu.conf.SECRET_KEY = 'cfXlBy5fzF0eDv2GUu3Y_qYeXfOk4rx-2X4lLFmU';
var bucketname = 'kookaburra';


exports.Save = function(req, res) {
    throw new Error('not implement!');
}

exports.Search = function(req, res) {
    throw new Error('not implement!');
}

exports.Read = function(req, res) {
    switch(req.params.id) {
        case 'uptoken':
            var putPolicy = new qiniu.rs.PutPolicy(bucketname);
            //putPolicy.callbackUrl = callbackUrl;
            //putPolicy.callbackBody = callbackBody;
            //putPolicy.returnUrl = returnUrl;
            //putPolicy.returnBody = returnBody;
            //putPolicy.asyncOps = asyncOps;
            //putPolicy.expires = expires;
            var uptoken = putPolicy.token();
            return {uptoken: uptoken};
        default:
            throw new Error('not implement!');
   } 
}

exports.Delete = function(req, res) {
    throw new Error('not implement!');
}


