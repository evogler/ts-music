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
exports.intervals = exports.cumulative = exports._bisect = exports.sortedBy = exports.fitIn = exports.nthMod = exports.range = exports.windowMod = exports.mod = exports.doWithOdds = exports.withOdds = exports.sample = exports.shuffled = exports.choice = exports.randInt = exports.randStep = exports.rand = void 0;
exports.rand = Math.random;
var randStep = function (a, b, c) {
    return Math.floor((0, exports.rand)() * ((b - a) / c + 1)) * c + a;
};
exports.randStep = randStep;
var randInt = function (a, b) { return (0, exports.randStep)(a, b, 1); };
exports.randInt = randInt;
var choice = function (arr) { return arr.at((0, exports.rand)() * arr.length); };
exports.choice = choice;
var shuffled = function (arr) {
    // TODO: performance
    var withIndices = arr.map(function (x) { return [(0, exports.rand)(), x]; });
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
var withOdds = function (ifSo, ifNot) {
    return function (odds) {
        return (0, exports.rand)() < odds ? ifSo : ifNot;
    };
};
exports.withOdds = withOdds;
var doWithOdds = function (fn) {
    return function (odds) {
        if ((0, exports.rand)() < odds) {
            fn();
        }
    };
};
exports.doWithOdds = doWithOdds;
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
var comp = function (a, b) {
    if (b < a)
        return 1;
    if (a < b)
        return -1;
    return 0;
};
var sortedBy = function (pred) {
    return function (arr) {
        var res = __spreadArray([], arr, true);
        res.sort(function (a, b) { return comp(pred(a), pred(b)); });
        return res;
    };
};
exports.sortedBy = sortedBy;
var _bisect = function (arr) {
    return function (n) {
        if (n < arr[0])
            return -1;
        if (n > arr.slice(-1)[0])
            return arr.length - 1;
        var a = 0;
        var b = arr.length;
        while (a < b) {
            var m = Math.floor((a + b) / 2);
            var _a = [arr[m], arr[m + 1]], a0 = _a[0], a1 = _a[1];
            if (n >= a0 && n < a1)
                return m;
            if (n > a0)
                a = m + 1;
            else
                b = m;
        }
        return a;
    };
};
exports._bisect = _bisect;
var cumulative = function (arr, start) {
    if (start === void 0) { start = 0; }
    var res = [start];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var n = arr_1[_i];
        res.push(n + res.at(-1));
    }
    return res;
};
exports.cumulative = cumulative;
var intervals = function (arr) {
    var res = [];
    for (var i = 0; i < (arr.length - 1); i++) {
        res.push(arr[i + 1] - arr[i]);
    }
    return res;
};
exports.intervals = intervals;
