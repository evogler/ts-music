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
var functional_1 = require("./functional");
var math_1 = require("./math");
var pitchesByRandIntervals = function (_a) {
    var intervals = _a.intervals, window = _a.window, length = _a.length;
    var res = [math_1.randInt.apply(void 0, window)];
    while (res.length < length) {
        var interval = (0, math_1.choice)(intervals);
        var nextNote = (0, math_1.windowMod)(window)(res.at(-1) + interval);
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
        return pitches.map(function (pitch) { return (pitch % 12) + (0, math_1.choice)(octaves); });
    };
};
var shiftNotesRandomly = function (odds) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { pitch: note.pitch + (0, math_1.withOdds)((0, math_1.choice)([-1, 1]), 0)(odds) })); });
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
var sortByTime = function (passage) {
    passage.sort(function (a, b) { return a.time - b.time; });
};
var sortedByTime = function (passage) {
    var res = __spreadArray([], passage, true);
    sortByTime(res);
    return res;
};
var combinePassages = function (passages) {
    var res = [];
    for (var _i = 0, passages_1 = passages; _i < passages_1.length; _i++) {
        var passage = passages_1[_i];
        for (var _a = 0, passage_1 = passage; _a < passage_1.length; _a++) {
            var note = passage_1[_a];
            res.push(note);
        }
    }
    return sortedByTime(res);
};
var addPassage = function (passage1) {
    return function (passage2) {
        return combinePassages([passage1, passage2]);
    };
};
var combinePassagesSoloed = function (barLen) {
    if (barLen === void 0) { barLen = 4; }
    return function (passages) {
        var shouldSoundAtTime = function (idx) {
            return function (time) {
                var soloCountNum = Math.floor(time / barLen);
                return soloCountNum % passages.length === idx;
            };
        };
        var res = [];
        for (var i = 0; i < passages.length; i++) {
            var should = shouldSoundAtTime(i);
            for (var _i = 0, _a = passages[i]; _i < _a.length; _i++) {
                var note = _a[_i];
                if (should(note.time)) {
                    res.push(note);
                }
            }
        }
        return sortedByTime(res);
    };
};
var makeRandIntPart = function () {
    var intCount = (0, math_1.randInt)(2, 4);
    var intOptions = [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
    var intervals = (0, math_1.sample)(intCount)(intOptions);
    var pitches = pitchesByRandIntervals({
        intervals: intervals,
        window: [0, 24],
        length: 1000,
    });
    var durationOptions = (0, math_1.sample)((0, math_1.randInt)(2, 4))([0.5, 0.5, 1, 1.5, 2]);
    var durations = pitches.map(function (_) { return (0, math_1.choice)(durationOptions); });
    return pitchesAndDurationsToPassage(pitches, durations);
};
var makeLoopNotesPart = function (_a) {
    var _b = _a.count, count = _b === void 0 ? 4 : _b, _c = _a.length, length = _c === void 0 ? 500 : _c, durations = _a.durations;
    var pitches = (0, math_1.sample)(count)((0, math_1.range)(24));
    var durationOptions = durations !== null && durations !== void 0 ? durations : (0, math_1.sample)((0, math_1.randInt)(2, 4))([0.5, 0.5, 1, 1.5, 2]);
    var _durations = pitches.map(function (_) { return (0, math_1.choice)(durationOptions); });
    var velocity = 50;
    var time = 0;
    var passage = [];
    for (var i = 0; i < length; i++) {
        var nth = (0, math_1.nthMod)(i);
        var pitch = nth(pitches);
        var duration = nth(_durations);
        passage.push({ time: time, duration: duration, pitch: pitch, velocity: velocity });
        time += duration;
    }
    return passage;
};
var makeDrumPart = function () {
    var length = 500;
    var KICK = 36;
    var SNARE = 38;
    var HAT = 42;
    var HAT_OPEN = 46;
    var res = [];
    var time = 0;
    var idx = 0;
    var notes = [
        { pitch: KICK, velocity: 120, odds: 1 },
        { pitch: HAT, velocity: 20, odds: 0.3 },
        { pitch: HAT, velocity: 60, odds: 0.8 },
        { pitch: HAT, velocity: 20, odds: 0.3 },
        { pitch: SNARE, velocity: 90, odds: 1 },
        { pitch: HAT, velocity: 20, odds: 0.3 },
        { pitch: HAT, velocity: 60, odds: 0.8 },
        { pitch: HAT, velocity: 20, odds: 0.3 },
    ];
    var durations = (0, math_1.fitIn)(8)([4, 2, 2, 2, 3, 2, 2, 2]);
    while (time < length) {
        var nth = (0, math_1.nthMod)(idx);
        var _a = nth(notes), _pitch = _a.pitch, velocity = _a.velocity, odds = _a.odds;
        var pitch = _pitch === HAT ? (0, math_1.withOdds)(HAT_OPEN, HAT)(.1) : _pitch;
        var duration = nth(durations);
        if ((0, math_1.rand)() < odds) {
            res.push({ pitch: pitch, velocity: velocity, time: time, duration: duration, channel: 9 });
        }
        time += duration;
        idx += 1;
    }
    return res;
};
//////////////////////////////////////////////////
var main = function () {
    (0, functional_1.pipeline)([
        makeLoopNotesPart({ durations: [1.5, 2.0], count: 3 }),
        makeLoopNotesPart({ durations: [0.5, 0.5, 1], count: 7 }),
        makeLoopNotesPart({ durations: [3.5], count: 3 }),
        makeRandIntPart(),
    ], combinePassagesSoloed(5.5), shiftNotesRandomly(0.1), transpose(60), addPassage(makeDrumPart()), passageToJsonSong(300), console.log);
};
main();
