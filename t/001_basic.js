(function () {
"use strict";

var Helper = require('./test/node-test');
Helper.define();
var DataValidator = require('../data-validator');

subtest('type map', function () {
    var v = DataValidator.typeMap;
       ok(   v.isString( new String('foo') )  );
       ok(   v.isString( 'foo' )              );
       ok(   v.isNumber( 1 )                  );
       ok(   v.isNumber( new Number('1') )    );
       ok(   v.isFunction( function () {} )   );
       ok(   v.isObject( {} )                 );
       ok(   v.isObject( new Object )         );
       ok(   v.isObject( [] )                 );
       ok(   v.isBoolean( true )              );
       ok(  !v.isBoolean( 1 )                 );
       ok(   v.isInteger( 1 )                 );
       ok(  !v.isInteger( -1 )                );
       ok(   v.isRegExp( /foo/ )              );
       ok(   v.isStr( 'foo' )                 );
       ok(   v.isInt( 1 )                     );
       ok(   v.isNum( -1 )                    );
       ok(   v.isBool( true )                 );
       ok(   v.isObj( {} )                    );
       ok(   v.isFunc( function () {} )       );

       [v.isString, v.isNumber, v.isFunction, v.isRegExp, v.isArray, v.isObject, v.isBoolean, v.isInteger, v.isInt, v.isStr, v.isNum, v.isBool, v.isObj, v.isFunc].forEach(function (func) {
           ok( !func.call(DataValidator.typeMap), func.toString() );
       });
});

subtest('validate args', function () {
    var testFunc = function () {
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
        try {
        var ret = testFunc({ artist: 'Perfume' }); // XXX 死
        } catch (e) {
            console.trace(e);
        }
        ok(ret);
        is(ret.artist, 'Perfume');
    })();
    (function () {
        dies_ok(
            function () { testFunc({ foo: 'bar' }) },
            /Argument .+ is required/
        );
    })();
    (function () {
        dies_ok(
            function () { testFunc({ artist: [] }) },
            /Validation failed/
        );
    })();
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

// XXX
// - enum
// - alias

done_testing();

}).call(this);
