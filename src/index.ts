import { pipeline } from "./pipeline";
import {
  _bisect,
  choice,
  cumulative,
  doWithOdds,
  fitIn,
  mod,
  nthMod,
  oneTwoOdds,
  rand,
  randInt,
  randStep,
  range,
  sample,
  shuffled,
  sortedBy,
  windowMod,
  withOdds,
} from "./math";
import { Cycle, cycle, take, xx } from "./functional";
import { makeCycleSwitcher, makeDrumPart, makeHitsPart } from "./makeParts";
import { transposeByChannel, loopSectionNTimes, transpose, deleteNotesRandomly, addPassage, passageToJsonSong } from "./musicBuildingBlocks";

const main = () => {
  const melodyPart = pipeline(
    makeCycleSwitcher(),
    transposeByChannel({
      0: choice([0, 4, 7]),
      1: choice([0, 4, 7]),
      2: choice([0, 4, 7]),
      3: choice([0, 4, 7]),
      4: choice([0, 4, 7]),
      5: choice([0, 4, 7]),
      6: choice([0, 4, 7]),
      7: choice([0, 4, 7]),
      8: choice([0, 4, 7]),
    }),
    // makeRandIntPart({}),
    // loopSectionNTimes(0, 5)(0)(12),
    loopSectionNTimes(0, 13)(0)(12),
    loopSectionNTimes(0, 32)(0)(12),
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
    transpose(60),
    transpose(-12 + randInt(0, 4))
    // experimentalPitchToChord,
  );

  const drumPart = pipeline(
    makeDrumPart(),
    deleteNotesRandomly(oneTwoOdds(16, 0, 0.3)),
    loopSectionNTimes(0, 32)(0)(94)
  );

  pipeline(
    melodyPart,

    // shiftNotesRandomly([-2, -1, 1, 2])(0.1),

    addPassage(drumPart),
    addPassage(makeHitsPart([16], 500)),
    passageToJsonSong(320),
    console.log
  );
};

// const t0 = performance.now();
main();
// const t1 = performance.now();
// console.log(t1 - t0);
