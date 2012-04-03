(function () {

var sprintf = require('./sprintf');
var _       = require ('./modules/underscore/underscore-min');

_.isInt  = _.isInteger = function(obj) { return _.isNumber(obj) && obj >= 0 };
_.isStr  = _.isString;
_.isNum  = _.isNumber;
_.isBool = _.isBoolean;
_.isObj  = _.isObject;
_.isFunc = _.isFunction;
var defined = function (stuff) { return !_.isUndefined(stuff) }

var DataValidator = {
    validate: function (rules, arguments) {
        var self  = this;
        var usage = this._getUsage(rules);
        var args  = arguments[0] || (function() {
            throw new Error(sprintf('Arguments must be a object\n%s', usage));
        })();
        var orig_args = _.clone(args);

        _.each(rules, function(rule, ruleName) {
            if (_.isString(rule)) rule = { isa: rule };

            var aliases = _.compact(_.flatten([ruleName, rule.alias]));
            var key = _.find(aliases, function (alias) { return _.has(args, alias) })
            if (!defined(key)) key = aliases[0];
            var ret = defined(args[key]) ? args[key] : rule.default;
            if (!_.has(args, ruleName)) args[ruleName] = ret;
            aliases.forEach(function (alias) { args[alias] = ret });

            var validator = _['is' + rule.isa];
            if (!validator)
                throw new Error(sprintf("Type not found: '%s'", rule.isa));
            if (!(rule.optional || _.has(rule, 'default') || _.has(orig_args, key) ))
                throw new Error(sprintf("Argument '%s' is required\n%s", ruleName, usage))
            if (!(rule.optional || validator(ret) || rule.default))
                throw new Error(sprintf("Validation failed for '%s'\n%s", rule.isa, usage));
        });
        return args;
    },
    _getUsage: function (rules) {
        return 'Usage: \n' + this._indent(
            sprintf(
                'function(\n%s\n);',
                _.map(rules, function (rule, ruleName) {
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
