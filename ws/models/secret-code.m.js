'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    ;
    
var SecretCodeSchema = mongoose.Schema({ 
    itemKey: {type: String, index: true},   //如用户名等。 
    code: {type: String, index: true},
    lifeSeconds: {type: Number, default: 600},  //有效期(秒), 缺省10分钟
    maxFailedTimes: {type: Number, default: 3}, //最大允许失败的次数

    failedTimes: Number, //已经失败次数
    mktime: Date,
});

SecretCodeSchema.methods.Save = function() {
    var _this = this;
    // Check Parameters
    if (!_this.itemKey)
        throw new Error("missing parameter 'itemKey'");

    // create code if not exists
    if (!_this.code)
        _this.code = (10000 + Math.round(Math.random() * 90000)) + '';

    var RemoveTheOld = function() {
        return mongoose.model('SecretCode').remove({itemKey: _this.itemKey}).exec();
    };

    var DoSave = function() {
        return Q.ninvoke(_this, 'save').then(function(items){
            return items[0];
        });
    };
    return Q().then(RemoveTheOld)
              .then(DoSave);
}

SecretCodeSchema.methods.Check = function() {
    var _this = this;
    return _this.constructor.findOne({
        itemKey: _this.itemKey,
        code: _this.code,
    }).exec().then(function(sc){
        if (sc) {
            return {
                isPass: true,
                reason: '',
            }
        }else {
            return {
                isPass: false,
                reason: 'Secret code check failed.'
            }
        }
    })
}

var SecretCode = mongoose.model('SecretCode', SecretCodeSchema);

