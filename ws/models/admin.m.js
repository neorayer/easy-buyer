'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , ak = require('../../zjs/army-knife.js')
    ;
    
var AdminSchema = mongoose.Schema({
    username: String,
    password: String,
    realname: String,
    createTime: Date,
    status: String,
    comment: String,
});

AdminSchema.statics.Auth = function(p) {
    var errMsg = "您输入信息无法通过验证，请检查后重新输入。";
    var admin = null;

    var CheckAndCreateFirstAdmin = function() {
        return Admin.find().lean().exec().then(function(admins){
            if (admins.length > 0)
                return;
            //创建第一个Admin
            return new Admin({
                username: 'admin',
                password: 'admin',
            }).Save();
        })
    }

    var FindAdmin = function() {
        return Admin.findOne({username: p.username}).lean().exec().then(function(u){
            if (!u) 
                ak.ThrowError('password', errMsg);
            admin = u;
        })
    }

    var CheckPassword = function() {
        if (p.password !== admin.password)
            ak.ThrowError('password', errMsg);
    }
    

    return Q()
              .then(CheckAndCreateFirstAdmin)
              .then(FindAdmin)
              .then(CheckPassword)
              .then(function(){
                return {
                    _id: 'none',
                    admin: admin,
                }
              });
}

AdminSchema.methods.Save = function() {
    //属性验证
    this.Validate();

    var _this = this;

    var LoadAdmin = function() {
        return Admin.findOne({
            username: _this.username, 
        }).exec();
    }

    var SaveAdmin = function() {
        _this.createTime = Date.now();
        return Q.ninvoke(_this, 'save')
                .then(function(admins){
                    return admins[0]
                });
    }

    return Q()
            .then(LoadAdmin)
            .then(function(admin){
                if (admin)
                    ak.ThrowError('username', '管理员用户名已存在，无法添加。');
            })
            .then(SaveAdmin);
    
}

AdminSchema.methods.Validate = function() {
    if (!this.password)
        ak.ThrowError('password', '缺少密码');
    if (!this.username)
        ak.ThrowError('username', '缺少用户');
}

AdminSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var Admin = mongoose.model('Admin', AdminSchema);

