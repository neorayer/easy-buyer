'use strict'

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Q = require('q')
    , validator = require('validator')
    ;
    
var CategorySchema = mongoose.Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    pid: String,
    name: String,
});


CategorySchema.methods.Save = function() {
    var _this = this;
    _this.sendTime = Date.now();
    return Q.ninvoke(_this, 'save')
            .then(function(datas){
                return datas[0]
            });
}

CategorySchema.methods.Delete = function() {
    var _this = this;
    function DeleteChildren() {
        Category.find({pid: _this._id}).exec().then(function(children){
            return children.map(function(child){ return child.Delete();});
        })
    };
    function DeleteSelf() {
        return Q.ninvoke(_this, 'remove');
    }
    return Q.when()
            .then(DeleteChildren)
            .then(DeleteSelf);
}

var Category = mongoose.model('Category', CategorySchema);

