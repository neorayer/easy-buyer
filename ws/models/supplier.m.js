'use strict'

var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, Q = require('q')
	, log = require('log4js').getLogger()
	
	;

var SupplierSchema = mongoose.Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company'
	},
	name: String,
	nickname: String,
	country: String,	
	address: String,
	contactPerson: String,
	phone: String,
	fax: String,
	website: String,
	email: String,
	businessType: String,
	yearEstablished: String,
	yearStartExporting: String,
	numberOfEmployees: String,
	description: String,
    status: {
        type: String,  // 'raw', 'accepted', 'rejected', 
        default: 'raw',
    },
    createTime: Date,
    modifyTime: Date,
    creater: {
        _id: String,
        name: String,
    },
})

SupplierSchema.methods.Delete = function() {
	return Q.ninvoke(this, 'remove');
}

SupplierSchema.statics.DeleteMass = function(ids) {
	return Q.all(ids.map(function(id){
		return new Supplier({_id: id}).Delete();
	})).then(function(){
		return 'OK';
	});
}


SupplierSchema.methods.Save = function() {
	var _this = this;
	_this.modifyTime = _this.createTime = Date.now();
	return Q.ninvoke(this, 'save')
	.then(function(datas){
		return datas[0];
	});
}

var Supplier = mongoose.model('Supplier', SupplierSchema);
