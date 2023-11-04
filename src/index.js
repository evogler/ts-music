"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pipeline_1 = require("./pipeline");
var math_1 = require("./math");
var makeParts_1 = require("./makeParts");
var musicBuildingBlocks_1 = require("./musicBuildingBlocks");
var main = function () {
    var bpm = 320;
    var melodyPart = function (durs) {
        if (durs === void 0) { durs = []; }
        return (0, pipeline_1.pipeline)(
        // makeCycleSwitcher(),
        (0, makeParts_1.makeAddingAndSubtractingPart)({ durs: durs }), (0, musicBuildingBlocks_1.transposeByChannel)({
            // 0: choice([0, 2, 7]),
            0: 0,
            1: (0, math_1.choice)([0, 2, 7]),
            // 2: choice([0, 2, 7]),
            2: 2,
            3: (0, math_1.choice)([0, 2, 7]),
            // 4: choice([0, 2, 7]),
            4: 5,
            5: (0, math_1.choice)([0, 2, 7]),
            6: (0, math_1.choice)([0, 2, 7]),
            7: (0, math_1.choice)([0, 2, 7]),
            8: (0, math_1.choice)([0, 2, 7]),
        }), 
        // makeRandIntPart({}),
        // loopSectionNTimes(0, 5)(0)(12),
        // loopSectionNTimes(0, 27)(0)(12),
        // loopSectionNTimes(0, 64)(0)(12),
        // staccatoRandomly(0.25)(oneTwoOdds(5.5, 0.1, 0.9)),
        // accentRandomly(oneOdds(0.2)),
        // // staccatoRandomly(0.25)(0.2),
        // deleteNotesRandomly(
        //   sectionOdds(
        //     xx(9)(() => 8),
        //     xx(8)(rand)
        //   )
        // ),
        // loopSectionNTimes(0, 64)(0)(22),
        // shiftNotesRandomly([4, 5, 6])(oneTwoOdds(20, 0, 0.4)),
        // shiftNotesRandomly([-2, -1, 0, 1, 2])(oneOdds(.6)),
        // deleteNotesRandomly(oneTwoOdds(32, 0, 0.5)),
        (0, musicBuildingBlocks_1.transpose)(60), (0, musicBuildingBlocks_1.transpose)(-12 + (0, math_1.randInt)(0, 4))
        // experimentalPitchToChord,
        );
    };
    var drumPart = (0, pipeline_1.pipeline)((0, makeParts_1.makeDrumPart)(), (0, musicBuildingBlocks_1.deleteNotesRandomly)((0, math_1.oneTwoOdds)(16, 0, 0.3)), (0, musicBuildingBlocks_1.loopSectionNTimes)(0, 32)(0)(94));
    (0, pipeline_1.pipeline)((0, musicBuildingBlocks_1.combinePassagesSoloed)((0, musicBuildingBlocks_1.randomSections)(3)(1, 8))([
        melodyPart([0.5]),
        melodyPart([1.0, 1.5]),
        melodyPart(),
    ]), 
    // addPassage(melodyPart()),
    (0, musicBuildingBlocks_1.shiftNotesRandomly)([/* -2, -1, 1, 2 */ 3])((0, math_1.oneTwoOdds)(8, 0, 1)), (0, musicBuildingBlocks_1.addPassage)(drumPart), 
    // addPassage(makeHitsPart([64], 500)),
    (0, musicBuildingBlocks_1.velocityArc)(function (note) { return note; }), (0, musicBuildingBlocks_1.passageToJsonSong)(bpm), console.log);
};
// const t0 = performance.now();
main();
// const t1 = performance.now();
// console.log(t1 - t0);
