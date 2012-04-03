(function () {

Object.prototype.each   = function(c){var o=this;var r=[];var i=0;for(var k in o) if(o.hasOwnProperty(k)){r.push(c.apply(o,[k,o[k],i++]))}return r}; 
var sprintf = require('./sprintf');

var TYPE_MAP = {
    'isString'  :function(obj) { return toString.call(obj) == '[object String]'   },
    'isNumber'  :function(obj) { return toString.call(obj) == '[object Number]'   },
    'isFunction':function(obj) { return toString.call(obj) == '[object Function]' },
    'isRegExp'  :function(obj) { return toString.call(obj) == '[object RegExp]'   },
    'isArray'   :function(obj) { return toString.call(obj) == '[object Array]'    },
    'isObject'  :function(obj) { return obj === Object(obj) },
    'isBoolean' :function(obj) { return obj === true || obj === false || toString.call(obj) == '[object Boolean]' },
    'isInteger' :function(obj) { return TYPE_MAP.isNumber(obj) && obj >= 0 },
};
TYPE_MAP.isInt  = TYPE_MAP.isInteger;
TYPE_MAP.isStr  = TYPE_MAP.isString;
TYPE_MAP.isNum  = TYPE_MAP.isNumber;
TYPE_MAP.isBool = TYPE_MAP.isBoolean;
TYPE_MAP.isObj  = TYPE_MAP.isObject;
TYPE_MAP.isFunc = TYPE_MAP.isFunction;

var DataValidator = {
    typeMap: TYPE_MAP,
    validate: function (rules, arguments) {
        var args  = arguments[0];
        var usage = this._getUsage(rules);
        var self  = this;
        if (!args) throw sprintf('Arguments must be a object\n%s', usage);
        rules.each(function(name, rule) {
            if (self.typeMap.isString(rule)) rule = { isa: rule };
            if (rule.alias) args[rule.alias] = args[name];
            var validator = TYPE_MAP['is' + rule.isa];
            if (!validator)
                throw sprintf('Type not found: %s', rule.isa);
            if (!rule.optional && typeof args[name] === 'undefined')
                throw sprintf('Argument %s is required\n%s', name, usage)
            if (!rule.optional && !validator(args[name]))
                throw sprintf('Validation failed for %s\n%s', rule.isa, usage);
        });
        return args;
    },
    _getUsage: function (rules) {
        return 'Usage: \n' + this._indent(
            sprintf(
                'function(\n%s\n);',
                rules.each(function (name, rule) {
                    if (typeof rule === 'string') rule = { isa: rule };
                    return sprintf(
                        '\t%s : %s%s,',
                        name, rule.isa,
                        rule.optional ? ' (optional)' : ''
                    );
                }).join('\n')
            ),
            1
        );
    },
    _indent: function (lines, indent) {
        if (!indent) indent = 0;
        return lines.split('\n').map(function (line) {
            return (new Array(indent + 1)).join('\t') + line;
        }).join('\n');
    },
};

module.exports = DataValidator;

}).call(this);
