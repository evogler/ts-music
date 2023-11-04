import { pipeline } from "./pipeline";
import { _bisect, choice, oneOdds, oneTwoOdds, randInt } from "./math";
import {
  makeAddingAndSubtractingPart,
  makeCycleSwitcher,
  makeDrumPart,
  makeHitsPart,
} from "./makeParts";
import {
  transposeByChannel,
  loopSectionNTimes,
  transpose,
  deleteNotesRandomly,
  addPassage,
  passageToJsonSong,
  shiftNotesRandomly,
  combinePassagesSoloed,
  randomSections,
  velocityArc,
} from "./musicBuildingBlocks";

const main = () => {
  const bpm = 320;
  const melodyPart = (durs = ([] as number[])) =>
    pipeline(
      // makeCycleSwitcher(),
      makeAddingAndSubtractingPart({ durs }),
      transposeByChannel({
        // 0: choice([0, 2, 7]),
        0: 0,
        1: choice([0, 2, 7]),
        // 2: choice([0, 2, 7]),
        2: 2,
        3: choice([0, 2, 7]),
        // 4: choice([0, 2, 7]),
        4: 5,
        5: choice([0, 2, 7]),
        6: choice([0, 2, 7]),
        7: choice([0, 2, 7]),
        8: choice([0, 2, 7]),
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
    combinePassagesSoloed(randomSections(3)(1, 8))([
      melodyPart([0.5]),
      melodyPart([1.0, 1.5]),
      melodyPart(),
    ]),
    // addPassage(melodyPart()),
    shiftNotesRandomly([/* -2, -1, 1, 2 */3])(oneTwoOdds(8, 0, 1)),
    addPassage(drumPart),
    // addPassage(makeHitsPart([64], 500)),
    velocityArc((note) => note),
    passageToJsonSong(bpm),
    console.log
  );
};

// const t0 = performance.now();
main();
// const t1 = performance.now();
// console.log(t1 - t0);
