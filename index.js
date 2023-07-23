"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var functional_1 = require("./functional");
var randInt = function (a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
};
var choice = function (arr) { return arr.at(Math.random() * arr.length); };
var shuffled = function (arr) {
    // TODO: performance
    var withIndices = arr.map(function (x, idx) { return [idx, x]; });
    withIndices.sort(function (a, b) { return b[0] - a[0]; });
    return withIndices.map(function (item) { return item[1]; });
};
var sample = function (count) {
    return function (arr) {
        var res = [];
        var idxs = arr.map(function (_, idx) { return idx; });
        while (res.length < count && idxs.length > 0) {
            res.push(arr[idxs.splice(randInt(0, idxs.length - 1), 1)[0]]);
        }
        return res;
    };
};
var windowMod = function (_a) {
    var a = _a[0], b = _a[1];
    return function (n) {
        return ((n - a) % b) + a;
    };
};
var pitchesByRandIntervals = function (_a) {
    var intervals = _a.intervals, window = _a.window, length = _a.length;
    var res = [randInt.apply(void 0, window)];
    while (res.length < length) {
        var interval = choice(intervals);
        var nextNote = windowMod(window)(res.at(-1) + interval);
        res.push(nextNote);
    }
    return res;
};
var pitchesToPassage = function (pitches) {
    var time = 0;
    var duration = 0.5;
    var velocity = 50;
    var passage = [];
    for (var _i = 0, pitches_1 = pitches; _i < pitches_1.length; _i++) {
        var pitch = pitches_1[_i];
        passage.push({
            pitch: pitch,
            time: time,
            duration: duration,
            velocity: velocity,
        });
        time += duration;
    }
    return passage;
};
var pitchesAndDurationsToPassage = function (pitches, durations) {
    var time = 0;
    var velocity = 50;
    var passage = [];
    for (var i = 0; i < pitches.length; i++) {
        var pitch = pitches[i];
        var duration = durations[i % durations.length];
        passage.push({
            pitch: pitch,
            time: time,
            duration: duration,
            velocity: velocity,
        });
        time += duration;
    }
    return passage;
};
var addChannel = function (channel) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { channel: channel })); });
    };
};
var randomizeOctave = function (octaves) {
    return function (pitches) {
        return pitches.map(function (pitch) { return (pitch % 12) + choice(octaves); });
    };
};
var transpose = function (amount) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { pitch: note.pitch + amount })); });
    };
};
var passageToJsonSong = function (bpm) {
    return function (passage) {
        return JSON.stringify({
            notes: passage,
            bpm: bpm,
        });
    };
};
var makeRandIntPart = function () {
    var intCount = randInt(2, 4);
    var intOptions = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
    var intervals = sample(intCount)(intOptions);
    var pitches = pitchesByRandIntervals({
        intervals: intervals,
        window: [0, 24],
        length: 1000,
    });
    var durationOptions = sample(randInt(2, 4))([0.5, 0.5, 1, 1.5, 2]);
    var durations = pitches.map(function (_) { return choice(durationOptions); });
    return pitchesAndDurationsToPassage(pitches, durations);
};
//////////////////////////////////////////////////
var main = function () {
    (0, functional_1.pipeline)(makeRandIntPart(), transpose(60), passageToJsonSong(300), console.log);
};
main();
