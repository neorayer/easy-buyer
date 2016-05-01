'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , _ = require('lodash')
    , validator = require('validator')
    , ak = require('../../zjs/army-knife.js')
    ;
    
var ConsumerSchema = mongoose.Schema({
    email: {
        type: String,
        index: {unique: true},
    },
    password: String,
    name: String,
    country: String,
    company: String,
    tel: String,
    createTime: Date,
});

ConsumerSchema.statics.Auth = function(p) {
    if (!p.email)
        ak.ThrowError('email', 'Please input valid email');
    if (!p.password)
        ak.ThrowError('password', 'Please input password');

    p.email = _.trim(p.email);
    p.password = _.trim(p.password);

    var errMsg = "Authentication failed";
    var consumer = null;

    var FindConsumer = function() {
        return Consumer.findOne({email: p.email}).lean().exec().then(function(u){
            if (!u) 
                ak.ThrowError('password', errMsg);
            consumer = u;
        })
    }

    var CheckPassword = function() {
        if (p.password !== consumer.password)
            ak.ThrowError('password', errMsg);
    }

    return Q() 
              .then(FindConsumer)
              .then(CheckPassword)
              .then(function(){
                return {
                    _id: 'none',
                    consumer: consumer,
                }
              });
}



ConsumerSchema.methods.Save = function() {
    var _this = this;

    //属性验证
    ValidateEmail(_this.email);
    ValidatePwd(_this.password);

    var CheckEmailUnused = function() {
        return Consumer.findOne({email: _this.email}).exec()
        .then(function(consumer){
            if (consumer) {
                ak.ThrowError('email', '您输入的Email已被注册。');
            }
        });
    }

    var SaveConsumer = function() {
        _this.createTime = Date.now();
        return Q.ninvoke(_this, 'save')
                .then(function(consumers){
                    return consumers[0]
                });
    }

    return Q()
            .then(CheckEmailUnused)
            .then(SaveConsumer);
    
}

function ValidatePwd(pwd, pwdFieldName) {
    var fieldName= pwdFieldName || 'password';

    if (!pwd || !validator.isLength(pwd, 6))
        ak.ThrowError(fieldName, '密码至少包含6个字符');
    if (!validator.isAscii(pwd))
        ak.ThrowError(fieldName, '密码必须由字符、数字或下划线组成 ');
}

function ValidateEmail(email) {
    if (!email || !validator.isEmail(email))
        ak.ThrowError('email', 'Email 格式错误');
}


ConsumerSchema.methods.ChangePassword = function(oldpass, newpass) {
    var _this = this;
    if (oldpass !== _this.password)
        ak.ThrowError('oldpass', 'The old password is incorrect');

    ValidatePwd(newpass, 'newpass');

    return _this.update({$set: {password: newpass}}).exec().then(function(da){
        return {_id: _this._id}
    });

}

ConsumerSchema.statics.ResetPwd = function(email, pwd) {
    email = email ? email : email.trim();
    console.log(pwd)
    if (pwd) pwd = pwd.trim();

    ValidatePwd(pwd);

    var consumer;

    var loadConsumer = function() {
        return Consumer.findOne({email: email}).exec().then(function(u){
            if (!u)
                ak.ThrowError('email', 'email在数据库中不存在');
            consumer = u;
            consumer.password = pwd;
        });
    }

    var updatePwd = function() {
        return Q.ninvoke(consumer, 'save')
        .then(function(datas){
            return datas[0];
        });
    }

    return Q()
            .then(loadConsumer)
            .then(updatePwd);
}

ConsumerSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var Consumer = mongoose.model('Consumer', ConsumerSchema);

