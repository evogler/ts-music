"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fitIn = exports.nthMod = exports.range = exports.windowMod = exports.mod = exports.withOdds = exports.sample = exports.shuffled = exports.choice = exports.randInt = exports.rand = void 0;
exports.rand = Math.random;
var randInt = function (a, b) {
    return Math.floor((0, exports.rand)() * (b - a + 1)) + a;
};
exports.randInt = randInt;
var choice = function (arr) { return arr.at((0, exports.rand)() * arr.length); };
exports.choice = choice;
var shuffled = function (arr) {
    // TODO: performance
    var withIndices = arr.map(function (x, idx) { return [idx, x]; });
    withIndices.sort(function (a, b) { return b[0] - a[0]; });
    return withIndices.map(function (item) { return item[1]; });
};
exports.shuffled = shuffled;
var sample = function (count) {
    return function (arr) {
        var res = [];
        var idxs = arr.map(function (_, idx) { return idx; });
        while (res.length < count && idxs.length > 0) {
            res.push(arr[idxs.splice((0, exports.randInt)(0, idxs.length - 1), 1)[0]]);
        }
        return res;
    };
};
exports.sample = sample;
var withOdds = function (a, b) {
    return function (odds) {
        return (0, exports.rand)() < odds ? a : b;
    };
};
exports.withOdds = withOdds;
var mod = function (divisor) { return function (dividend) {
    return ((dividend % divisor) + divisor) % divisor;
}; };
exports.mod = mod;
var windowMod = function (_a) {
    var a = _a[0], b = _a[1];
    return function (n) {
        return (0, exports.mod)(b - a)(n) + a;
    };
};
exports.windowMod = windowMod;
var range = function (a, b) {
    if (b === undefined)
        return (0, exports.range)(0, a);
    return __spreadArray([], new Array(b - a), true).map(function (_, idx) { return idx + a; });
};
exports.range = range;
var nthMod = function (idx) {
    return function (arr) {
        return arr[idx % arr.length];
    };
};
exports.nthMod = nthMod;
var fitIn = function (overallLength) {
    return function (durs) {
        var sum = durs.reduce(function (n, acc) { return n + acc; }, 0);
        var ratio = overallLength / sum;
        return durs.map(function (n) { return n * ratio; });
    };
};
exports.fitIn = fitIn;
