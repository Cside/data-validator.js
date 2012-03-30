(function () {

"use strict";

Object.prototype.values = function() {var o=this;var r=[];for(var k in o) if(o.hasOwnProperty(k)){r.push(o[k])}return r};
Object.prototype.keys   = function() {var o=this;var r=[];for(var k in o) if(o.hasOwnProperty(k)){r.push(  k )}return r};
Object.prototype.each   = function(c){var o=this;var r=[];var i=0;for(var k in o) if(o.hasOwnProperty(k)){r.push(c.apply(o,[k,o[k],i++]))}return r}; 

var TYPE_MAP = {
    'isString'  :function(obj) { return toString.call(obj) == '[object String]'   },
    'isNumber'  :function(obj) { return toString.call(obj) == '[object Number]'   },
    'isFunction':function(obj) { return toString.call(obj) == '[object Function]' },
    'isRegExp'  :function(obj) { return toString.call(obj) == '[object RegExp]'   },
    'isArray'   :function(obj) { return toString.call(obj) == '[object Array]'    },
    'isObject'  :function(obj) { return obj === Object(obj) },
    'isBoolean' :function(obj) { return obj === true || obj === false || toString.call(obj) == '[object Boolean]' },
    'isInteger' :function(obj) { return this.isNumber(obj) && obj >= 0 },
};
TYPE_MAP.isInt  = TYPE_MAP.isInteger;
TYPE_MAP.isStr  = TYPE_MAP.isString;
TYPE_MAP.isNum  = TYPE_MAP.isNumber;
TYPE_MAP.isBool = TYPE_MAP.isBoolean;
TYPE_MAP.isObj  = TYPE_MAP.isObject;
TYPE_MAP.isFunc = TYPE_MAP.isFunction;

var DataValidator = {
    validate: function (rules, args) {
        args = args[0];
        if (!args) args = {};
        var self = this;
        rules.each(function(name, rule, i) {
            if (self.typeMap.isString(rule))
                rule = { isa: rule };
            var validator = TYPE_MAP['is' + rule.isa];
            if (!validator)
                throw 'Type not found: ' + rule.isa;
            if (!rule.optional && typeof args[name] === 'undefined')
                throw 'Argument ' + name + ' is required'
            if (!rule.optional && !validator(args[name]))
                throw 'Validation failed for ' + rule.isa;
        });
        return args;
    },
    typeMap: TYPE_MAP,
};

module.exports = DataValidator;

}).call(this);
