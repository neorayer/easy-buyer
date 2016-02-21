'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
    ;
    
var SupplierUserSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    email: String,
    password: String,
    role: String,
    isPubContact: Boolean,
    contact: {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
    },
    fullname: {
        first: String,
        mid: String,
        last: String,
    }

});

SupplierUserSchema.statics.Auth = function(p) {
    var errMsg = "您输入信息无法通过验证，请检查后重新输入。";
    var company = null;
    var user = null;


    var FindUser = function() {
        return SupplierUser.findOne({email: p.email}).lean().exec().then(function(u){
            if (!u) throw new Error(errMsg);
            user = u;
        })
    }

    var FindCompany = function() {
        if (p.entrance !== 'trader')
            return;
        if (!user.company)
            throw new Error(errMsg + '您没有权限登录交易商平台');
        return Company.findOne({_id: user.company}).exec().then(function(co){
            if (!co) throw new Error(errMsg);
            company = co;
        });
    }

    var CheckPassword = function() {
        if (p.password !== user.password)
            throw new Error(errMsg);
    }
    

    return Q() 
              .then(FindUser)
              .then(FindCompany)
              .then(CheckPassword)
              .then(function(){
                return {
                    user: user,
                    company: company,
                }
              });
}

SupplierUserSchema.methods.Save = function() {
    //属性验证
    var errMsg = this.Validate();
    if (errMsg)
        throw new Error(errMsg);

    var _this = this;

    var LoadUser = function() {
        return SupplierUser.findOne({
            email: _this.email, 
        }).exec();
    }

    var SaveUser = function() {
        return Q.ninvoke(_this, 'save')
                .then(function(users){
                    return users[0]
                });
    }

    return Q()
            .then(LoadUser)
            .then(function(user){
                if (user)
                    throw new Error('用户已存在，无法添加。');
            })
            .then(SaveUser);
    
}

SupplierUserSchema.methods.Validate = function() {
    if (!this.password)
        return "缺少密码";
    if (!this.email)
        return "Email地址";
}

SupplierUserSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var SupplierUser = mongoose.model('SupplierUser', SupplierUserSchema);

