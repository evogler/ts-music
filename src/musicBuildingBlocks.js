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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.sectionAtTime = exports.pitchesByRandIntervals = exports.toScale = exports.experimentalPitchToChord = exports.flattenChannels = exports.transposeByChannel = exports.addTimeDurations = exports.randomSections = exports.combinePassagesSoloed = exports.addPassage = exports.loopSectionNTimes = exports.exciseSection = exports.combinePassages = exports.sortedByTime = exports.sortByTime = exports.passageToJsonSong = exports.offsetTime = exports.transpose = exports.keepRandomly = exports.deleteNotesRandomly = exports.staccatoRandomly = exports.accentRandomly = exports.shiftNotesRandomly = exports.randomizeOctave = exports.addChannel = exports.pitchesAndDurationsToPassage = exports.pitchesToPassage = exports.COWBELL = exports.HAT_OPEN = exports.HAT = exports.SNARE = exports.KICK = void 0;
var math_1 = require("./math");
exports.KICK = 36;
exports.SNARE = 38;
exports.HAT = 42;
exports.HAT_OPEN = 46;
exports.COWBELL = 56;
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
exports.pitchesToPassage = pitchesToPassage;
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
exports.pitchesAndDurationsToPassage = pitchesAndDurationsToPassage;
var addChannel = function (channel) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { channel: channel })); });
    };
};
exports.addChannel = addChannel;
var randomizeOctave = function (octaves) {
    return function (pitches) {
        return pitches.map(function (pitch) { return (pitch % 12) + (0, math_1.choice)(octaves); });
    };
};
exports.randomizeOctave = randomizeOctave;
var shiftNotesRandomly = function (intervals) {
    return function (oddsFn) {
        return function (passage) {
            return passage.map(function (note) { return (__assign(__assign({}, note), { pitch: note.pitch + (0, math_1.withOdds)((0, math_1.choice)(intervals), 0)(oddsFn(note).value) })); });
        };
    };
};
exports.shiftNotesRandomly = shiftNotesRandomly;
var accentRandomly = function (oddsFn) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { velocity: (0, math_1.withOdds)(Math.min(127, note.velocity + 15), note.velocity)(oddsFn(note).value) })); });
    };
};
exports.accentRandomly = accentRandomly;
var staccatoRandomly = function (stacattoDuration) {
    return function (oddsFn) {
        return function (passage) {
            return passage.map(function (note) { return (__assign(__assign({}, note), { duration: (0, math_1.withOdds)(Math.min(stacattoDuration, note.duration), note.duration)(oddsFn(note).value) })); });
        };
    };
};
exports.staccatoRandomly = staccatoRandomly;
var deleteNotesRandomly = function (oddsFn) {
    return function (passage) {
        return passage.filter(function (note) { return (0, math_1.rand)() > oddsFn(note).value; });
    };
};
exports.deleteNotesRandomly = deleteNotesRandomly;
var keepRandomly = function (oddsFn) {
    return function (passage) {
        return passage.filter(function (note) { return (0, math_1.rand)() < oddsFn(note).value; });
    };
};
exports.keepRandomly = keepRandomly;
var transpose = function (amount) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { pitch: note.pitch + amount })); });
    };
};
exports.transpose = transpose;
var offsetTime = function (offset) {
    return function (passage) {
        return passage.map(function (note) { return (__assign(__assign({}, note), { time: note.time + offset })); });
    };
};
exports.offsetTime = offsetTime;
var passageToJsonSong = function (bpm) {
    return function (passage) {
        return JSON.stringify({
            notes: passage,
            bpm: bpm,
        });
    };
};
exports.passageToJsonSong = passageToJsonSong;
var sortByTime = function (passage) {
    passage.sort(function (a, b) { return a.time - b.time; });
};
exports.sortByTime = sortByTime;
var sortedByTime = function (passage) {
    var res = __spreadArray([], passage, true);
    (0, exports.sortByTime)(res);
    return res;
};
exports.sortedByTime = sortedByTime;
var combinePassages = function (passages) {
    var res = [];
    for (var _i = 0, passages_1 = passages; _i < passages_1.length; _i++) {
        var passage = passages_1[_i];
        for (var _a = 0, passage_1 = passage; _a < passage_1.length; _a++) {
            var note = passage_1[_a];
            res.push(note);
        }
    }
    return (0, exports.sortedByTime)(res);
};
exports.combinePassages = combinePassages;
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
exports.exciseSection = exciseSection;
var loopSectionNTimes = function (passageStart, passageEnd) {
    return function (newStart) {
        return function (times) {
            return function (passage) {
                var loop = (0, exports.exciseSection)(passageStart, passageEnd)(newStart)(passage);
                var loopLen = passageEnd - passageStart;
                var loops = [loop];
                for (var i = 1; i < times; i++) {
                    loops.push((0, exports.offsetTime)(i * loopLen)(loop));
                }
                return (0, exports.combinePassages)(loops);
            };
        };
    };
};
exports.loopSectionNTimes = loopSectionNTimes;
var addPassage = function (passage1) {
    return function (passage2) {
        return (0, exports.combinePassages)([passage1, passage2]);
    };
};
exports.addPassage = addPassage;
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
        return (0, exports.sortedByTime)(res);
    };
};
exports.combinePassagesSoloed = combinePassagesSoloed;
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
exports.randomSections = randomSections;
var addTimeDurations = function (passage) {
    var res = [];
    for (var i = 0; i < passage.length - 1; i++) {
        var note = passage[i];
        var note2 = passage[i + 1];
        var timeDuration = note2.time - note.time;
        res.push(__assign(__assign({}, note), { timeDuration: timeDuration }));
    }
    return res;
};
exports.addTimeDurations = addTimeDurations;
var transposeByChannel = function (channelMap) {
    return function (passage) {
        return passage.map(function (note) {
            var _a;
            return (__assign(__assign({}, note), { pitch: note.pitch + ((_a = channelMap[note.channel]) !== null && _a !== void 0 ? _a : 0) }));
        });
    };
};
exports.transposeByChannel = transposeByChannel;
var flattenChannels = function (passage) {
    return passage.reduce(function (acc, noteC) { return __spreadArray(__spreadArray([], acc, true), noteC.channels.map(function (channel) {
        var channels = noteC.channels, rest = __rest(noteC, ["channels"]);
        return __assign(__assign({}, rest), { channel: channel });
    }), true); }, []);
};
exports.flattenChannels = flattenChannels;
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
exports.experimentalPitchToChord = experimentalPitchToChord;
var toScale = function (scale) {
    return function (passage) {
        var res = [];
        for (var _i = 0, passage_4 = passage; _i < passage_4.length; _i++) {
            var note = passage_4[_i];
            var pitch = note.pitch;
            while (!scale.includes((0, math_1.mod)(12)(pitch))) {
                pitch += 1;
            }
            res.push(__assign(__assign({}, note), { pitch: pitch }));
        }
        return res;
    };
};
exports.toScale = toScale;
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
exports.pitchesByRandIntervals = pitchesByRandIntervals;
var sectionAtTime = function (sectionLengths) {
    var cums = (0, math_1.cumulative)(sectionLengths);
    var __bisect = (0, math_1._bisect)(cums);
    var loopLen = cums.at(-1);
    return function (note) { return __bisect(note.time % loopLen); };
};
exports.sectionAtTime = sectionAtTime;
