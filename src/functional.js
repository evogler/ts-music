"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xx = exports.take = exports.cycle = void 0;
var cycle = function (arr) {
    var pos = 0;
    return {
        next: function () {
            var res = arr[pos];
            pos = (pos + 1) % arr.length;
            return res;
        },
    };
};
exports.cycle = cycle;
var take = function (count) {
    return function (arr) {
        return arr.slice(0, count);
    };
};
exports.take = take;
var xx = function (times) {
    return function (fn) {
        var res = [];
        for (var i = 0; i < times; i++) {
            res.push(fn());
        }
        return res;
    };
};
exports.xx = xx;
