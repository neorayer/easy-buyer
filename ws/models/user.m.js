'use strict'

var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Q = require('q')
	, _ = require('lodash')
	, validator = require('validator')
	, ak = require('../../zjs/army-knife.js')

	, Company = mongoose.model('Company')
	;
	
var UserSchema = mongoose.Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
	},
	email: {
		type: String,
		index: {unique: true},
	},
	password: String,
	role: String,
	isPubContact: Boolean,
	name: String,
	tel: String,
	createTime: Date,
});

UserSchema.statics.Auth = function(p) {
	if (!p.email)
		ak.ThrowError('email', 'Please input valid email');
	if (!p.password)
		ak.ThrowError('password', 'Please input password');

	p.email = _.trim(p.email);
	p.password = _.trim(p.password);

	var errMsg = "您输入的信息验证没有通过，请检查您的输入。";
	var company = null;
	var user = null;


	var FindUser = function() {
		return User.findOne({email: p.email}).lean().exec().then(function(u){
			if (!u) 
				ak.ThrowError('password', errMsg);
			user = u;
		})
	}


	var FindCompany = function() {
//		if (!user.company)
//			throw new Error(errMsg + '您没有权限登录交易商平台');
		return Company.findOne({_id: user.company}).exec().then(function(co){
			if (!co) 
				ak.ThrowError('password', errMsg);
			company = co;
		});
	}

	var CheckPassword = function() {
		if (p.password !== user.password)
			ak.ThrowError('password', errMsg);
	}
	

	return Q() 
			  .then(FindUser)
			  .then(FindCompany)
			  .then(CheckPassword)
			  .then(function(){
			  	return {
			  		_id: 'none',
			  		user: user,
			  		company: company,
			  	}
			  });
}



UserSchema.methods.Save = function() {
	var _this = this;

	//属性验证
	ValidateEmail(_this.email);
	ValidatePwd(_this.password);

	var CheckEmailUnused = function() {
		return User.findOne({email: _this.email}).exec()
		.then(function(user){
			if (user) {
				ak.ThrowError('email', '您输入的Email已被注册。');
			}
		});
	}

	var SaveUser = function() {
		_this.createTime = Date.now();
		return Q.ninvoke(_this, 'save')
				.then(function(users){
					return users[0]
				});
	}

	return Q()
			.then(CheckEmailUnused)
			.then(SaveUser);
	
}

function ValidatePwd(pwd) {
	if (!pwd || !validator.isLength(pwd, 6))
		ak.ThrowError('password', '密码至少包含6个字符');
	if (!validator.isAscii(pwd))
		ak.ThrowError('password', '密码必须由字符、数字或下划线组成 ');
}

function ValidateEmail(email) {
	if (!email || !validator.isEmail(email))
		ak.ThrowError('email', 'Email 格式错误');
}


UserSchema.statics.ResetPwd = function(email, pwd) {
	email = email ? email : email.trim();
	console.log(pwd)
	if (pwd) pwd = pwd.trim();

	ValidatePwd(pwd);

	var user;

	var loadUser = function() {
		return User.findOne({email: email}).exec().then(function(u){
			if (!u)
				ak.ThrowError('email', 'email在数据库中不存在');
			user = u;
			user.password = pwd;
		});
	}

	var updatePwd = function() {
		return Q.ninvoke(user, 'save')
		.then(function(datas){
			return datas[0];
		});
	}

	return Q()
			.then(loadUser)
			.then(updatePwd);
}

UserSchema.methods.Delete = function() {
	var _this = this;
	return Q.ninvoke(_this, 'remove');
}

var User = mongoose.model('User', UserSchema);

