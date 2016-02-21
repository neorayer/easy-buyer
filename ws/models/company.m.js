'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , _ = require('lodash')
    , validator = require('validator')

    , ak = require('../../zjs/army-knife.js')
    ;
    
var CompanySchema = mongoose.Schema({
    name: {
        type: String,
        unique: 'company name has exist',
    },
    nickname: String,
    name_en: String,
    email: String,
    password: String,
    contactName: String,
    contactTel: String,
    contactEmail: String,
    createTime: Date,
});

CompanySchema.methods.Validate = function() {
    var _this = this;
    _this.name = _.trim(this.name);
    _this.nickname = _.trim(this.nickname);

    if (!_this.name)
        ak.ThrowError('name', 'Company name is required');

    if (!validator.isLength(_this.name, 2))
        ak.ThrowError('name', 'Company name length must be more than 2 letters');

}

CompanySchema.methods.Save = function() {
    var User = mongoose.model('User');
    this.Validate();


    var Finishjob = {};

    var _this = this;

    var CheckUnique = function() {
        if (!_this._id)  //说明是要修改，不是新增
            return;
        return Company.findOne({name: _this.name}).exec().then(function(co){
            if (co) {
                ak.ThrowError('name', '公司名已被注册。如果你认为你的公司账户被抢注，请与我们的客服联系。');
            }
        });
    }

    var company = null;
    var CreateCompany = function() {
        _this.createTime = Date.now();
        return Q.ninvoke(_this, 'save').then(function(cos){
            company = cos[0];
            Finishjob.isCompanyCreated = true;
        });
    };

     var user = new User({
        email:    _this.email,
        password: _this.password,
        name:     _this.contactName,
        tel:      _this.contactTel,
        role:     'admin',
        isPubContact: true,
    });
    var CreateFirstUser = function() {
        user.company = company._id;
        return user.Save().then(function(u){
            user = u;
            Finishjob.isUserCreated = true;
        });
    }

    var Reverse = function(err) {
        if (Finishjob.isCompanyCreated)
            company.Delete();
        if (Finishjob.isUserCreated)
            user.Delete();
        throw err;
    }
    
    return Q().then(CheckUnique)
              .then(CreateCompany)
              .then(CreateFirstUser)
              .then(function() { return company; })
              .catch(Reverse)
              ;
}

CompanySchema.methods.Delete = function() {
    var User = mongoose.model('User')
    var _this = this;

    // Delete users
    var DeleteUsers = function() {
        User.find({company: _this._id}).exec().then(function(users) {
            return Q.all(users.map(function(user){
                user.Delete();
            }))
        });
    }

    var DeleteCompany = function() {
        return Q.ninvoke(_this, 'remove');
    }

    return Q().then(DeleteUsers)
              .then(DeleteCompany);
}

var Company = mongoose.model('Company', CompanySchema);

