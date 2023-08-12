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
var pipeline_1 = require("./pipeline");
var math_1 = require("./math");
var functional_1 = require("./functional");
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
var shiftNotesRandomly = function (intervals) {
    return function (oddsFn) {
        return function (passage) {
            return passage.map(function (note) { return (__assign(__assign({}, note), { pitch: note.pitch + (0, math_1.withOdds)((0, math_1.choice)(intervals), 0)(oddsFn(note).value) })); });
        };
    };
};
var accentRandomly = function (oddsFn) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { velocity: (0, math_1.withOdds)(Math.min(127, note.velocity + 15), note.velocity)(oddsFn(note).value) })); });
    };
};
var staccatoRandomly = function (stacattoDuration) {
    return function (oddsFn) {
        return function (passage) {
            return passage.map(function (note) { return (__assign(__assign({}, note), { duration: (0, math_1.withOdds)(Math.min(stacattoDuration, note.duration), note.duration)(oddsFn(note).value) })); });
        };
    };
};
var deleteNotesRandomly = function (oddsFn) {
    return function (passage) {
        return passage.filter(function (note) { return (0, math_1.rand)() > oddsFn(note).value; });
    };
};
var keepRandomly = function (oddsFn) {
    return function (passage) {
        return passage.filter(function (note) { return (0, math_1.rand)() < oddsFn(note).value; });
    };
};
var transpose = function (amount) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { pitch: note.pitch + amount })); });
    };
};
var offsetTime = function (offset) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { time: note.time + offset })); });
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
var exciseSection = function (passageStart, passageEnd) {
    return function (newStart) {
        return function (passage) {
            var res = [];
            var timeOffset = newStart - passageStart;
            for (var _i = 0, passage_2 = passage; _i < passage_2.length; _i++) {
                var note = passage_2[_i];
                if (note.time < passageStart)
                    continue;
                if (note.time >= passageEnd)
                    return res;
                res.push(__assign(__assign({}, note), { time: note.time + timeOffset }));
            }
            return res;
        };
    };
};
var loopSectionNTimes = function (passageStart, passageEnd) {
    return function (newStart) {
        return function (times) {
            return function (passage) {
                var loop = exciseSection(passageStart, passageEnd)(newStart)(passage);
                var loopLen = passageEnd - passageStart;
                var loops = [loop];
                for (var i = 1; i < times; i++) {
                    loops.push(offsetTime(i * loopLen)(loop));
                }
                return combinePassages(loops);
            };
        };
    };
};
var addPassage = function (passage1) {
    return function (passage2) {
        return combinePassages([passage1, passage2]);
    };
};
var combinePassagesSoloed = function (sections) {
    return function (passages) {
        var _a, _b, _c, _d, _e, _f, _g;
        // TODO: performance?
        // XXX: doesn't define what happens at the end of sections
        var res = [];
        for (var passIdx = 0; passIdx < passages.length; passIdx++) {
            var passage = passages[passIdx];
            var sectionsPos = 0;
            var nextSectionTime = (_b = (_a = sections[1]) === null || _a === void 0 ? void 0 : _a.time) !== null && _b !== void 0 ? _b : Infinity;
            var shouldSound = sections[0].part === passIdx;
            for (var _i = 0, _h = passages[passIdx]; _i < _h.length; _i++) {
                var note = _h[_i];
                var time = note.time;
                if (time > nextSectionTime) {
                    while (((_d = (_c = sections[sectionsPos]) === null || _c === void 0 ? void 0 : _c.time) !== null && _d !== void 0 ? _d : Infinity) < time) {
                        sectionsPos += 1;
                    }
                    nextSectionTime = (_f = (_e = sections[sectionsPos]) === null || _e === void 0 ? void 0 : _e.time) !== null && _f !== void 0 ? _f : Infinity;
                    shouldSound = ((_g = sections[sectionsPos]) === null || _g === void 0 ? void 0 : _g.part) === passIdx;
                }
                if (shouldSound) {
                    res.push(note);
                }
            }
        }
        return sortedByTime(res);
    };
};
var randomSections = function (partCount) {
    return function (minLen, maxLen) {
        var sectionCount = 500;
        var res = [];
        var time = 0;
        for (var i = 0; i < sectionCount; i++) {
            var part = (0, math_1.randInt)(0, partCount - 1);
            // const part = i % 20 < 10 ? choice([0, 1, 4, 5]) : choice([2, 3, 4, 5]);
            res.push({ time: time, part: part });
            time += (0, math_1.randStep)(minLen, maxLen, 0.5);
            // time += choice([1, 1.5, 2, 2.5, 3]);
        }
        return res;
    };
};
var experimentalPitchToChord = function (passage) {
    var randChord = function () { return (0, math_1.sample)((0, math_1.randInt)(1, 3))((0, math_1.range)(-12, 24)); };
    var chordCount = 24;
    var chords = Object.fromEntries((0, math_1.range)(chordCount).map(function (n) { return [n, randChord()]; }));
    var res = [];
    for (var _i = 0, passage_3 = passage; _i < passage_3.length; _i++) {
        var note = passage_3[_i];
        var intervals = chords[(0, math_1.mod)(chordCount)(note.pitch)];
        for (var _a = 0, intervals_1 = intervals; _a < intervals_1.length; _a++) {
            var interval = intervals_1[_a];
            res.push(__assign(__assign({}, note), { pitch: note.pitch + interval }));
        }
    }
    return res;
};
var oddsType = function (odds) { return ({ _type: "odds", value: odds }); };
var oneOdds = function (odds) {
    return function () {
        return oddsType(odds);
    };
};
var oneTwoOdds = function (segmentLength, firstOdds, secondOdds) {
    return function (note) {
        return oddsType(note.time % (2 * segmentLength) < segmentLength ? firstOdds : secondOdds);
    };
};
var sectionAtTime = function (sectionLengths) {
    var cums = (0, math_1.cumulative)(sectionLengths);
    var __bisect = (0, math_1._bisect)(cums);
    var loopLen = cums.at(-1);
    return function (note) { return __bisect(note.time % loopLen); };
};
var sectionOdds = function (sectionLengths, odds) {
    var getSection = sectionAtTime(sectionLengths);
    return function (note) { return oddsType(odds[getSection(note)]); };
};
var makeRandIntPart = function (_a) {
    var _b = _a.window, window = _b === void 0 ? [0, 36] : _b;
    var intCount = (0, math_1.randInt)(3, 4);
    // const intOptions = [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
    var intOptions = [-4, -3, -2, -1, 1, 2, 3, 4];
    var intervals = (0, math_1.sample)(intCount)(intOptions);
    var pitches = pitchesByRandIntervals({
        intervals: intervals,
        window: window,
        length: 1000,
    });
    var durationOptions = (0, math_1.sample)((0, math_1.randInt)(1, 3))([0.5, 0.5, 1, 1.5, 2]);
    durationOptions.push(0.5);
    // const durationOptions = sample(randInt(2, 4))([0.5, 0.5, 1, 1.5, 2]);
    // const durationOptions = sample(randInt(2, 4))([1, 1.5, 2]);
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
var makeCycleSwitcher = function () {
    var totalNotes = 500;
    // const switchOdds = 0.1;
    var cycles = [];
    [
        (0, pipeline_1.pipeline)(makeRandIntPart({ window: [-12, 24] }), (0, functional_1.take)(2)),
        (0, pipeline_1.pipeline)(makeRandIntPart({ window: [-12, 24] }), (0, functional_1.take)(2)),
        (0, pipeline_1.pipeline)(makeRandIntPart({ window: [-12, 24] }), (0, functional_1.take)(2)),
        (0, pipeline_1.pipeline)(makeRandIntPart({ window: [-12, 24] }), (0, functional_1.take)(2)),
        (0, pipeline_1.pipeline)(makeRandIntPart({ window: [-12, 24] }), (0, functional_1.take)(2)),
        (0, pipeline_1.pipeline)(makeRandIntPart({ window: [-12, 24] }), (0, functional_1.take)(2)),
    ].forEach(function (x) { return cycles.push((0, functional_1.cycle)(x)); });
    // cycles.push(
    //   pipeline(
    //     makeLoopNotesPart({ count: 6, length: 5, durations: [1, 1.5] }),
    //     sortedBy((note: Note) => note.pitch),
    //     transpose(12),
    //     cycle
    //   )
    // );
    var res = [];
    var time = 0;
    var cyclePos = 0;
    var totalSwitches = 0;
    for (var i = 0; i < totalNotes; i++) {
        var note = cycles[cyclePos].next();
        res.push(__assign(__assign({}, note), { time: time }));
        time += note.duration;
        (0, math_1.doWithOdds)(function () {
            cyclePos = (cyclePos + 1) % cycles.length;
            totalSwitches += 1;
        })(0.65);
    }
    return res;
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
    var durations = (0, math_1.fitIn)(16)((0, math_1.shuffled)([2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 3, 4, 5, 2, 2]));
    while (time < length) {
        var nth = (0, math_1.nthMod)(idx);
        var _a = nth(notes), _pitch = _a.pitch, velocity = _a.velocity, odds = _a.odds;
        var pitch = _pitch === HAT ? (0, math_1.withOdds)(HAT_OPEN, HAT)(0.1) : _pitch;
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
//////////////////////////////////////////////////
var main = function () {
    var melodyPart = (0, pipeline_1.pipeline)(
    // makeCycleSwitcher(),
    makeRandIntPart({}), loopSectionNTimes(0, 5)(0)(12), loopSectionNTimes(0, 7)(0)(12), loopSectionNTimes(0, 9)(0)(12), staccatoRandomly(0.25)(oneTwoOdds(5.5, 0.1, 0.9)), accentRandomly(oneOdds(0.2)), 
    // staccatoRandomly(0.25)(0.2),
    deleteNotesRandomly(sectionOdds((0, functional_1.xx)(9)(function () { return 8; }), (0, functional_1.xx)(8)(math_1.rand))), loopSectionNTimes(0, 64)(0)(22), shiftNotesRandomly([4, 5, 6])(oneTwoOdds(20, 0, 0.4)), shiftNotesRandomly([-1, 1])(oneTwoOdds(24, 0, 0.2)), 
    // deleteNotesRandomly(oneTwoOdds(27, 0, 0.3)),
    transpose(60), transpose(-12)
    // experimentalPitchToChord,
    );
    var drumPart = (0, pipeline_1.pipeline)(makeDrumPart(), deleteNotesRandomly(oneTwoOdds(16, 0, 0.3)), loopSectionNTimes(0, 32)(0)(94));
    (0, pipeline_1.pipeline)(melodyPart, 
    // shiftNotesRandomly([-2, -1, 1, 2])(0.1),
    addPassage(drumPart), passageToJsonSong(320), console.log);
};
// const t0 = performance.now();
main();
// const t1 = performance.now();
// console.log(t1 - t0);
