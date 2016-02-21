'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , log = require('log4js').getLogger()
    
    ;

var OpptSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    name: String, 
    client: { //客户
        type: Schema.Types.ObjectId,
        ref: 'Client',
    },
    contact: { // 客户联系人
        type: Schema.Types.ObjectId,
        ref: 'Contact',
    },
    opptDate: Date, // 发现时间
    source: String,  //来源
    opptOwner: {  //我方负责人
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    need: String, //客户需求
    priority: String, //优先级
    step: String, // 当前阶段
    status: String, //状态
    possibility: String, //可能性
    comment: String, //备注

    documents: [Schema.Types.Mixed],
});

OpptSchema.methods.Delete = function() {
    return Q.ninvoke(this, 'remove');
}

OpptSchema.statics.DeleteMass = function(ids) {
    return Q.all(ids.map(function(id){
        return new Oppt({_id: id}).Delete();
    })).then(function(){
        return 'OK';
    });
}


OpptSchema.methods.Save = function() {
    return Q.ninvoke(this, 'save')
    .then(function(datas){
        return datas[0];
    });
}

var Oppt = mongoose.model('Oppt', OpptSchema);
