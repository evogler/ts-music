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
exports.makeAddingAndSubtractingPart = exports.makeDrumPart = exports.makeHitsPart = exports.makeCycleSwitcher = exports.makeLoopNotesPart = exports.makeRandIntPart = void 0;
var functional_1 = require("./functional");
var math_1 = require("./math");
var musicBuildingBlocks_1 = require("./musicBuildingBlocks");
var pipeline_1 = require("./pipeline");
var makeRandIntPart = function (_a) {
    var _b = _a.window, window = _b === void 0 ? [0, 36] : _b;
    var intCount = (0, math_1.randInt)(3, 4);
    // const intOptions = [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
    var intOptions = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
    var intervals = (0, math_1.sample)(intCount)(intOptions);
    var pitches = (0, musicBuildingBlocks_1.pitchesByRandIntervals)({
        intervals: intervals,
        window: window,
        length: 1000,
    });
    var durationOptions = (0, math_1.sample)((0, math_1.randInt)(1, 3))([0.5, 0.5, 1, 1.5, 2]);
    durationOptions.push(0.5);
    // const durationOptions = sample(randInt(2, 4))([0.5, 0.5, 1, 1.5, 2]);
    // const durationOptions = sample(randInt(2, 4))([1, 1.5, 2]);
    var durations = pitches.map(function (_) { return (0, math_1.choice)(durationOptions); });
    var part = (0, musicBuildingBlocks_1.pitchesAndDurationsToPassage)(pitches, durations);
    var partWithStaccato = part.map(function (note) { return (__assign(__assign({}, note), { duration: (0, math_1.withOdds)(0.25, note.duration)(0.5) })); });
    return partWithStaccato;
};
exports.makeRandIntPart = makeRandIntPart;
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
exports.makeLoopNotesPart = makeLoopNotesPart;
var makeCycleSwitcher = function () {
    var totalNotes = 1500;
    var addRandomChannelOrder = function (note) { return (__assign(__assign({}, note), { channels: (0, math_1.sample)(9)((0, math_1.range)(0, 8 + 1)) })); };
    var partFn = function () {
        return (0, pipeline_1.pipeline)((0, exports.makeRandIntPart)({ window: [-12, 24] }), 
        // toScale([0, 2, 3, 5, 7, 10]),
        musicBuildingBlocks_1.addTimeDurations, (0, functional_1.take)((0, math_1.randInt)(5, 7)), function (x) { return x.map(addRandomChannelOrder); }, functional_1.cycle);
    };
    var cycles = (0, functional_1.xx)(25)(partFn);
    var res = [];
    var time = 0;
    var cyclePos = 0;
    var totalSwitches = 0;
    for (var i = 0; i < totalNotes; i++) {
        var note = cycles[cyclePos].next();
        res.push(__assign(__assign({}, note), { time: time }));
        time += note.timeDuration;
        (0, math_1.doWithOdds)(function () {
            cyclePos = (cyclePos + 1) % cycles.length;
            totalSwitches += 1;
            // })(time % 32 < 16 ? 0 : 0.5);
        })(0.2);
    }
    res = res.map(function (note) { return (__assign(__assign({}, note), { 
        // channels: note.channels.slice(0, 1 + Math.floor((note.time / 8) % 64)),
        channels: note.channels.slice(0, (0, math_1.randInt)(1, 8)) })); });
    res = (0, musicBuildingBlocks_1.flattenChannels)(res);
    return res;
};
exports.makeCycleSwitcher = makeCycleSwitcher;
var makeHitsPart = function (sectionLengths, totalLength, startTime) {
    if (startTime === void 0) { startTime = 0; }
    var res = [];
    var time = startTime;
    var sectionLengthsCycle = (0, functional_1.cycle)(sectionLengths);
    var velocity = 120;
    var duration = 0.5;
    // const pitches = [COWBELL, KICK, SNARE, HAT];
    var pitches = [musicBuildingBlocks_1.CRASH];
    var channel = 9;
    while (time < totalLength) {
        for (var _i = 0, pitches_1 = pitches; _i < pitches_1.length; _i++) {
            var pitch = pitches_1[_i];
            res.push({ time: time, pitch: pitch, duration: duration, velocity: velocity, channel: channel });
        }
        time += sectionLengthsCycle.next();
    }
    return res;
};
exports.makeHitsPart = makeHitsPart;
var makeDrumPart = function () {
    var length = 500;
    var res = [];
    var time = 0;
    var idx = 0;
    var notes = [
        { pitch: musicBuildingBlocks_1.KICK, velocity: 120, odds: 1 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 20, odds: 0.3 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 60, odds: 0.8 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 20, odds: 0.3 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 60, odds: 0.8 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 20, odds: 0.3 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 60, odds: 0.8 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 20, odds: 0.3 },
        { pitch: musicBuildingBlocks_1.SNARE, velocity: 90, odds: 1 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 20, odds: 0.3 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 60, odds: 0.8 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 20, odds: 0.3 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 60, odds: 0.8 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 20, odds: 0.3 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 60, odds: 0.8 },
        { pitch: musicBuildingBlocks_1.HAT, velocity: 20, odds: 0.3 },
    ];
    var durations = (0, math_1.fitIn)(16)((0, math_1.shuffled)([
        2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 3, 4, 5, 2,
        2,
    ].map(function (n) { return n + 3; })));
    while (time < length) {
        var nth = (0, math_1.nthMod)(idx);
        var _a = nth(notes), _pitch = _a.pitch, velocity = _a.velocity, odds = _a.odds;
        var pitch = _pitch === musicBuildingBlocks_1.HAT ? (0, math_1.withOdds)(musicBuildingBlocks_1.HAT_OPEN, musicBuildingBlocks_1.HAT)(0.1) : _pitch;
        var duration = nth(durations);
        var adjustedOdds = time % 32 < 16 ? Math.pow(odds, 2) : Math.pow(odds, 0.5);
        if ((0, math_1.rand)() < adjustedOdds) {
            res.push({ pitch: pitch, velocity: velocity, time: time, duration: duration, channel: 9 });
        }
        time += duration;
        idx += 1;
    }
    return res;
};
exports.makeDrumPart = makeDrumPart;
var makeAddingAndSubtractingPart = function (_a) {
    var _b = _a.durs, durs = _b === void 0 ? [] : _b;
    // XXX: relative vs absolute time not accounted for in types
    var numberOfSteps = 1240;
    var minCellSize = 1;
    var maxCellSize = 2;
    var startCellSize = 2;
    var changeOdds = 0.1;
    var randNote = function () {
        var time = (0, math_1.choice)(durs.length > 0
            ? durs
            : [
                0.125,
                0.125,
                0.125,
                0.125,
                0.5,
                0.5,
                1,
                1.5,
                (0, math_1.randRange)(0.25, 1.0),
                (0, math_1.randRange)(0.25, 1.0),
                (0, math_1.randRange)(0.25, 1.0),
                (0, math_1.randRange)(0.25, 1.0),
                (0, math_1.randRange)(0.5, 1.5),
            ]);
        var duration = (0, math_1.choice)([time, time, 0.25]);
        return {
            channels: (0, math_1.sample)((0, math_1.randInt)(1, 4))((0, math_1.range)(8)),
            // channels: sample(randInt(1, 3))([0, 2, 4]),
            duration: duration,
            pitch: (0, math_1.randInt)(0, 24),
            time: time,
            velocity: 70,
        };
    };
    var absolutizeTimes = function (startTime) {
        if (startTime === void 0) { startTime = 0; }
        return function (passage) {
            var time = startTime;
            var res = [];
            for (var _i = 0, passage_1 = passage; _i < passage_1.length; _i++) {
                var note = passage_1[_i];
                res.push(__assign(__assign({}, note), { time: time }));
                time += note.time;
            }
            return res;
        };
    };
    var firstStep = (0, functional_1.xx)(startCellSize)(randNote);
    var steps = [firstStep];
    var nextStep = function (lastStep) {
        var newStep = __spreadArray([], lastStep, true);
        (0, math_1.doWithOdds)(function () {
            if (newStep.length >= maxCellSize)
                return;
            var newNotePos = (0, math_1.randInt)(0, newStep.length - 1);
            var newNote = randNote();
            newStep.splice(newNotePos, 0, newNote);
        })(changeOdds);
        (0, math_1.doWithOdds)(function () {
            if (newStep.length <= minCellSize)
                return;
            var deletePos = (0, math_1.randInt)(0, newStep.length - 1);
            newStep.splice(deletePos, 1);
        })(changeOdds);
        return newStep;
    };
    for (var step = 1; step < numberOfSteps; step++) {
        steps.push(nextStep(steps.at(-1)));
    }
    var res = (0, pipeline_1.pipeline)(
    // shuffled(steps).flat(1),
    steps, (0, math_1.localShuffled)(20), 
    // shuffled,
    function (_) { return _.flat(1); }, absolutizeTimes(0), (0, musicBuildingBlocks_1.shiftNotesRandomly)([-3, -2, -1, 1, 2, 3])((0, math_1.oneOdds)(0.1)), musicBuildingBlocks_1.flattenChannels);
    // console.log(res);
    return res;
    // return [];
};
exports.makeAddingAndSubtractingPart = makeAddingAndSubtractingPart;
