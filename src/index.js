"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pipeline_1 = require("./pipeline");
var math_1 = require("./math");
var makeParts_1 = require("./makeParts");
var musicBuildingBlocks_1 = require("./musicBuildingBlocks");
var main = function () {
    var melodyPart = (0, pipeline_1.pipeline)((0, makeParts_1.makeCycleSwitcher)(), (0, musicBuildingBlocks_1.transposeByChannel)({
        0: (0, math_1.choice)([0, 4, 7]),
        1: (0, math_1.choice)([0, 4, 7]),
        2: (0, math_1.choice)([0, 4, 7]),
        3: (0, math_1.choice)([0, 4, 7]),
        4: (0, math_1.choice)([0, 4, 7]),
        5: (0, math_1.choice)([0, 4, 7]),
        6: (0, math_1.choice)([0, 4, 7]),
        7: (0, math_1.choice)([0, 4, 7]),
        8: (0, math_1.choice)([0, 4, 7]),
    }), 
    // makeRandIntPart({}),
    // loopSectionNTimes(0, 5)(0)(12),
    (0, musicBuildingBlocks_1.loopSectionNTimes)(0, 13)(0)(12), (0, musicBuildingBlocks_1.loopSectionNTimes)(0, 32)(0)(12), 
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
    // shiftNotesRandomly([-1, 1])(oneTwoOdds(24, 0.05, 0.8)),
    // deleteNotesRandomly(oneTwoOdds(32, 0, 0.5)),
    (0, musicBuildingBlocks_1.transpose)(60), (0, musicBuildingBlocks_1.transpose)(-12 + (0, math_1.randInt)(0, 4))
    // experimentalPitchToChord,
    );
    var drumPart = (0, pipeline_1.pipeline)((0, makeParts_1.makeDrumPart)(), (0, musicBuildingBlocks_1.deleteNotesRandomly)((0, math_1.oneTwoOdds)(16, 0, 0.3)), (0, musicBuildingBlocks_1.loopSectionNTimes)(0, 32)(0)(94));
    (0, pipeline_1.pipeline)(melodyPart, 
    // shiftNotesRandomly([-2, -1, 1, 2])(0.1),
    (0, musicBuildingBlocks_1.addPassage)(drumPart), (0, musicBuildingBlocks_1.addPassage)((0, makeParts_1.makeHitsPart)([16], 500)), (0, musicBuildingBlocks_1.passageToJsonSong)(320), console.log);
};
// const t0 = performance.now();
main();
// const t1 = performance.now();
// console.log(t1 - t0);
