(function() {
    var sprintf = function (str) {
        var args = Array.prototype.slice.call(arguments, 1);
        return str.replace(/%0(\d+)d/g, function(m, num) {
            var r = String(args.shift());
            var c = '';
            num = parseInt(num) - r.length;
            while (--num >= 0) c += '0';
            return c + r;
        }).replace(/%[sdf]/g, function(m) { return sprintf._SPRINTF_HASH[m](args.shift()) });
    };
    sprintf._SPRINTF_HASH = {
        '%s': String,
        '%d': parseInt,
        '%f': parseFloat
    };
    module.exports = sprintf;
})();
