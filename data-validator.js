(function () {

var sprintf = require('./sprintf');
var _       = require ('./modules/underscore/underscore-min');
Object.prototype.each   = function(c){var o=this;var r=[];var i=0;for(var k in o) if(o.hasOwnProperty(k)){r.push(c.apply(o,[k,o[k],i++]))}return r}; 

_.isInt  = _.isInteger = function(obj) { return _.isNumber(obj) && obj >= 0 };
_.isStr  = _.isString;
_.isNum  = _.isNumber;
_.isBool = _.isBoolean;
_.isObj  = _.isObject;
_.isFunc = _.isFunction;

var DataValidator = {
    validate: function (rules, arguments) {
        var args  = arguments[0];
        var usage = this._getUsage(rules);
        var self  = this;
        var defined = function (stuff) { !_.isUndefined(stuff) }
        if (!args) throw new Error(sprintf('Arguments must be a object\n%s', usage));
        rules.each(function(ruleName, rule) {
            if (_.isString(rule)) rule = { isa: rule };
            var ret     = defined(args[ruleName]) ? args[ruleName] : rule.default;
            var aliases = rule.alias;
            if (_.isArray(aliases)) {
                if (!defined(ret)) ret = args[_.find(aliases, function (alias) { return !!args[alias] })];
                if (!defined(args[ruleName])) args[ruleName] = ret;
                aliases.forEach(function (alias) { args[alias] = ret });
            } else {
                if (!defined(ret)) ret = args[aliases];
                if (!defined(args[ruleName])) args[ruleName] = ret;
                args[aliases] = ret;
            }
            var validator = _['is' + rule.isa];
            if (!validator)
                throw new Error(sprintf('Type not found: %s', rule.isa));
            if (!(rule.optional || defined(ret)))
                throw new Error(sprintf('Argument %s is required\n%s', ruleName, usage))
            if (!(rule.optional || validator(ret) || rule.default))
                throw new Error(sprintf('Validation failed for %s\n%s', rule.isa, usage));
        });
        return args;
    },
    _getUsage: function (rules) {
        return 'Usage: \n' + this._indent(
            sprintf(
                'function(\n%s\n);',
                rules.each(function (ruleName, rule) {
                    if (_.isString(rule)) rule = { isa: rule };
                    return sprintf(
                        '\t%s : %s%s,',
                        ruleName, rule.isa,
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
