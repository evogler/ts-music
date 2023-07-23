"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipeline = void 0;
var pipeline = function (initial) {
    var fns = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fns[_i - 1] = arguments[_i];
    }
    return fns.reduce(function (value, fn) { return fn(value); }, initial);
};
exports.pipeline = pipeline;
