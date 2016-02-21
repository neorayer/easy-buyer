'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    , Company = mongoose.model('Company')
   // , User = mongoose.model('User')
    ;
    
var MessageSchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    from: Schema.Types.Mixed,
    to: Schema.Types.Mixed,
    sendTime: Date,
    subject: String,
    mbox: String, // 'inbox', 'sent', 'draft', 'trash'
    isStar: Boolean,
    isRead: Boolean,
    isDone: Boolean,
    content: String,
    priority: String,
    dests: String,
});


MessageSchema.methods.Save = function() {
    var _this = this;
    _this.sendTime = Date.now();
    return Q.ninvoke(_this, 'save')
            .then(function(datas){
                return datas[0]
            });
}

MessageSchema.methods.Delete = function() {
    var _this = this;
    return Q.ninvoke(_this, 'remove');
}

var Message = mongoose.model('Message', MessageSchema);

