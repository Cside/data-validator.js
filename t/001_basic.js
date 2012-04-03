(function () {
"use strict";

var Helper        = require('./test/node-test');
var DataValidator = require('../data-validator')
Helper.define();

subtest('validate args', function () {
    var testFunc = function TEST () {
        var args = DataValidator.validate({
            artist: 'Str',
            limit:  { isa: 'Number', optional: 1 }
        }, arguments);
        return args;
    };
    (function () {
        var ret = testFunc({ limit: 10, artist: 'Perfume' });
        ok(ret);
        is(ret.artist, 'Perfume');
        is(ret.limit, 10);
    })();
    (function () {
        var ret = testFunc({ artist: 'Perfume' });
        ok(ret);
        is(ret.artist, 'Perfume');
    })();
    dies_ok(
        function () { testFunc({ foo: 'bar' }) },
        /Argument .+ is required/
    );
    dies_ok(
        function () { testFunc({ foo: 'bar' }) },
        /Usage/
    );
    dies_ok(
        function () { testFunc({ artist: [] }) },
        /Validation failed/
    );
    dies_ok(
        function () { testFunc({ artist: [] }) },
        /Usage/
    );
    dies_ok(
        function () { testFunc() },
        /Arguments must be a object/
    );
    dies_ok(
        function () { testFunc() },
        /Usage/
    );
})

subtest('undefined type', function () {
    var testFunc = function () {
        var args = DataValidator.validate({
            artist: 'Str',
            limit:  { isa: 'UndefinedType', optional: 1 }
        }, arguments);
        return args;
    };
    dies_ok(
        function () { testFunc({ artist: 'Perfume' }) },
        /Type not found/
    );
});

subtest('alias', function () {
    (function () {
        var testFunc = function () {
            var args = DataValidator.validate({
                limit: {isa: 'Int', alias: 'maxResults'}
            }, arguments);
            return args;
        };
        (function () {
            var ret = testFunc({limit: 10});
            ok(ret);
            is(ret.limit,      10);
            is(ret.maxResults, 10);
        })();
        (function () {
            var ret = testFunc({maxResults: 10});
            ok(ret);
            is(ret.limit,      10);
            is(ret.maxResults, 10);
        })();
    })();
    (function () {
        var testFunc = function () {
            var args = DataValidator.validate({
                limit: {isa: 'Int', alias: ['maxResults', 'max_results']}
            }, arguments);
            return args;
        };
        (function() {
            var ret = testFunc({maxResults: 10});
            ok(ret);
            is(ret.limit,       10);
            is(ret.maxResults,  10);
            is(ret.max_results, 10);
        })();
        (function() {
            var ret = testFunc({limit: 10});
            ok(ret);
            is(ret.limit,       10);
            is(ret.maxResults,  10);
            is(ret.max_results, 10);
        })();
    })();
});

subtest('none', function () {
    var testFunc = function () {
        var args = DataValidator.validate({
            limit: {isa: 'Int', optional: 25},
        }, arguments);
        return args;
    };
    var error;
    try {
        testFunc({});
    } catch (e) {
        error = e;
    }
    ok(!error);
});

subtest('default', function () {
    (function() {
        var testFunc = function () {
            var args = DataValidator.validate({
                limit: {isa: 'Int', default: 25},
            }, arguments);
            return args;
        };
        var ret = testFunc({});
        ok(ret);
        is(ret.limit, 25);
    })();
    (function() {
        var testFunc = function () {
            var args = DataValidator.validate({
                limit: {isa: 'Int', default: 25, alias: ['max_results', 'maxResults']},
            }, arguments);
            return args;
        };
        (function () {
            var ret = testFunc({});
            ok(ret);
            is(ret.limit,       25);
            is(ret.maxResults,  25);
            is(ret.max_results, 25);
        })();
        (function () {
            var ret = testFunc({max_results: undefined});
            ok(ret);
            is(ret.limit,       25);
            is(ret.maxResults,  25);
            is(ret.max_results, 25);
        })();
        (function () {
            var ret = testFunc({max_results: 0});
            ok(ret);
            is(ret.limit,       0);
            is(ret.maxResults,  0);
            is(ret.max_results, 0);
        })();
    })();
    (function() {
        var testFunc = function () {
            var args = DataValidator.validate({
                limit: {isa: 'Int', default: undefined, alias: ['max_results', 'maxResults']},
            }, arguments);
            return args;
        };
        var ret = testFunc({});
        ok(ret);
        is(ret.limit,       undefined);
        is(ret.maxResults,  undefined);
        is(ret.max_results, undefined);
    })();
});

// XXX
// - enum
// - Array[Object]
// - ClassName
// - where -> function () {...}

}).call(this);
