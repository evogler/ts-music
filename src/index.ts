import { pipeline } from "./pipeline";
import {
  _bisect,
  choice,
  cumulative,
  doWithOdds,
  fitIn,
  mod,
  nthMod,
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

type Note = {
  pitch: number;
  time: number;
  duration: number;
  velocity: number;
};

type NoteWithChannel = Note & { channel: number };

type Passage = Note[];

type PassageWithChannel = NoteWithChannel[];

type Odds = { _type: "odds"; value: number };

type OddsFn = (note: Note) => Odds;

const pitchesByRandIntervals = ({
  intervals,
  window,
  length,
}: {
  intervals: number[];
  window: [number, number];
  length: number;
}): number[] => {
  const res = [randInt(...window)];
  while (res.length < length) {
    const interval = choice(intervals);
    const nextNote = windowMod(window)((res.at(-1) as number) + interval);
    res.push(nextNote);
  }
  return res;
};

const pitchesToPassage = (pitches: number[]): Passage => {
  let time = 0;
  const duration = 0.5;
  const velocity = 50;
  const passage: Passage = [];
  for (const pitch of pitches) {
    passage.push({
      pitch: pitch,
      time: time,
      duration,
      velocity,
    });
    time += duration;
  }
  return passage;
};

const pitchesAndDurationsToPassage = (
  pitches: number[],
  durations: number[]
): Passage => {
  let time = 0;
  const velocity = 50;
  const passage: Passage = [];
  for (let i = 0; i < pitches.length; i++) {
    const pitch = pitches[i];
    const duration = durations[i % durations.length];
    passage.push({
      pitch: pitch,
      time: time,
      duration,
      velocity,
    });
    time += duration;
  }
  return passage;
};

const addChannel =
  (channel: number) =>
  (passage: Passage): PassageWithChannel =>
    passage.map((note) => ({ ...note, channel }));

const randomizeOctave =
  (octaves: number[]) =>
  (pitches: number[]): number[] =>
    pitches.map((pitch) => (pitch % 12) + choice(octaves));

const shiftNotesRandomly =
  (intervals: number[]) =>
  (oddsFn: OddsFn) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({
      ...note,
      pitch: note.pitch + withOdds(choice(intervals), 0)(oddsFn(note).value),
    }));

const accentRandomly =
  (oddsFn: OddsFn) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({
      ...note,
      velocity: withOdds(
        Math.min(127, note.velocity + 15),
        note.velocity
      )(oddsFn(note).value),
    }));

const staccatoRandomly =
  (stacattoDuration: number) =>
  (oddsFn: OddsFn) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({
      ...note,
      duration: withOdds(
        Math.min(stacattoDuration, note.duration),
        note.duration
      )(oddsFn(note).value),
    }));

const deleteNotesRandomly =
  (oddsFn: OddsFn) =>
  (passage: Passage): Passage =>
    passage.filter((note) => rand() > oddsFn(note).value);

const keepRandomly =
  (oddsFn: OddsFn) =>
  (passage: Passage): Passage =>
    passage.filter((note) => rand() < oddsFn(note).value);

const transpose =
  (amount: number) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({ ...note, pitch: note.pitch + amount }));

const offsetTime =
  (offset: number) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({ ...note, time: note.time + offset }));

const passageToJsonSong =
  (bpm: number) =>
  (passage: Passage): string =>
    JSON.stringify({
      notes: passage,
      bpm,
    });

const sortByTime = (passage: Passage): void => {
  passage.sort((a: Note, b: Note) => a.time - b.time);
};

const sortedByTime = (passage: Passage): Passage => {
  const res = [...passage];
  sortByTime(res);
  return res;
};

const combinePassages = (passages: Passage[]): Passage => {
  const res: Passage = [];
  for (const passage of passages) {
    for (const note of passage) {
      res.push(note);
    }
  }
  return sortedByTime(res);
};

const exciseSection =
  (passageStart: number, passageEnd: number) =>
  (newStart: number) =>
  (passage: Passage): Passage => {
    const res: Passage = [];
    const timeOffset = newStart - passageStart;
    for (const note of passage) {
      if (note.time < passageStart) continue;
      if (note.time >= passageEnd) return res;
      res.push({ ...note, time: note.time + timeOffset });
    }
    return res;
  };

const loopSectionNTimes =
  (passageStart: number, passageEnd: number) =>
  (newStart: number) =>
  (times: number) =>
  (passage: Passage): Passage => {
    const loop = exciseSection(passageStart, passageEnd)(newStart)(passage);
    const loopLen = passageEnd - passageStart;
    const loops = [loop];
    for (let i = 1; i < times; i++) {
      loops.push(offsetTime(i * loopLen)(loop));
    }
    return combinePassages(loops);
  };

const addPassage =
  (passage1: Passage) =>
  (passage2: Passage): Passage =>
    combinePassages([passage1, passage2]);

const combinePassagesSoloed =
  (sections: { time: number; part: number }[]) =>
  (passages: Passage[]): Passage => {
    // TODO: performance?
    // XXX: doesn't define what happens at the end of sections
    const res: Passage = [];
    for (let passIdx = 0; passIdx < passages.length; passIdx++) {
      const passage = passages[passIdx];
      let sectionsPos = 0;
      let nextSectionTime = sections[1]?.time ?? Infinity;
      let shouldSound = sections[0].part === passIdx;

      for (const note of passages[passIdx]) {
        const { time } = note;
        if (time > nextSectionTime) {
          while ((sections[sectionsPos]?.time ?? Infinity) < time) {
            sectionsPos += 1;
          }
          nextSectionTime = sections[sectionsPos]?.time ?? Infinity;
          shouldSound = sections[sectionsPos]?.part === passIdx;
        }
        if (shouldSound) {
          res.push(note);
        }
      }
    }
    return sortedByTime(res);
  };

const randomSections =
  (partCount: number) =>
  (minLen: number, maxLen: number): { time: number; part: number }[] => {
    const sectionCount = 500;
    const res = [];
    let time = 0;
    for (let i = 0; i < sectionCount; i++) {
      const part = randInt(0, partCount - 1);
      // const part = i % 20 < 10 ? choice([0, 1, 4, 5]) : choice([2, 3, 4, 5]);
      res.push({ time, part });
      time += randStep(minLen, maxLen, 0.5);
      // time += choice([1, 1.5, 2, 2.5, 3]);
    }
    return res;
  };

const experimentalPitchToChord = (passage: Passage): Passage => {
  const randChord = () => sample(randInt(1, 3))(range(-12, 24));
  const chordCount = 24;
  const chords = Object.fromEntries(
    range(chordCount).map((n) => [n, randChord()])
  );
  const res: Passage = [];
  for (const note of passage) {
    const intervals = chords[mod(chordCount)(note.pitch)];
    for (const interval of intervals) {
      res.push({ ...note, pitch: note.pitch + interval });
    }
  }
  return res;
};

const oddsType = (odds: number): Odds => ({ _type: "odds", value: odds });

const oneOdds =
  (odds: number): OddsFn =>
  () =>
    oddsType(odds);

const oneTwoOdds =
  (segmentLength: number, firstOdds: number, secondOdds: number): OddsFn =>
  (note: Note) =>
    oddsType(
      note.time % (2 * segmentLength) < segmentLength ? firstOdds : secondOdds
    );

const sectionAtTime = (sectionLengths: number[]) => {
  const cums = cumulative(sectionLengths);
  const __bisect = _bisect(cums);
  const loopLen = cums.at(-1) as number;
  return (note: Note): number => __bisect(note.time % loopLen);
};

const sectionOdds = (sectionLengths: number[], odds: number[]): OddsFn => {
  const getSection = sectionAtTime(sectionLengths);
  return (note: Note) => oddsType(odds[getSection(note)]);
};

const makeRandIntPart = ({ window = [0, 36] as [number, number] }) => {
  const intCount = randInt(3, 4);
  // const intOptions = [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
  const intOptions = [-4, -3, -2, -1, 1, 2, 3, 4];
  const intervals = sample(intCount)(intOptions);
  const pitches = pitchesByRandIntervals({
    intervals,
    window,
    length: 1000,
  });
  const durationOptions = sample(randInt(1, 3))([0.5, 0.5, 1, 1.5, 2]);
  durationOptions.push(0.5);
  // const durationOptions = sample(randInt(2, 4))([0.5, 0.5, 1, 1.5, 2]);
  // const durationOptions = sample(randInt(2, 4))([1, 1.5, 2]);
  const durations = pitches.map((_) => choice(durationOptions));
  return pitchesAndDurationsToPassage(pitches, durations);
};

const makeLoopNotesPart = ({
  count = 4,
  length = 500,
  durations,
}: {
  count?: number;
  length?: number;
  durations?: number[];
}) => {
  const pitches = sample(count)(range(24));
  const durationOptions =
    durations ?? sample(randInt(2, 4))([0.5, 0.5, 1, 1.5, 2]);
  const _durations = pitches.map((_) => choice(durationOptions));
  const velocity = 50;
  let time = 0;
  const passage: Passage = [];
  for (let i = 0; i < length; i++) {
    const nth = nthMod(i);
    const pitch = nth(pitches);
    const duration = nth(_durations);
    passage.push({ time, duration, pitch, velocity });
    time += duration;
  }
  return passage;
};

const makeCycleSwitcher = (): Passage => {
  const totalNotes = 500;
  // const switchOdds = 0.1;
  const cycles: Cycle<Note>[] = [];
  [
    pipeline(makeRandIntPart({ window: [-12, 24] }), take(2)),
    pipeline(makeRandIntPart({ window: [-12, 24] }), take(2)),
    pipeline(makeRandIntPart({ window: [-12, 24] }), take(2)),
    pipeline(makeRandIntPart({ window: [-12, 24] }), take(2)),
    pipeline(makeRandIntPart({ window: [-12, 24] }), take(2)),
    pipeline(makeRandIntPart({ window: [-12, 24] }), take(2)),
  ].forEach((x) => cycles.push(cycle(x)));

  // cycles.push(
  //   pipeline(
  //     makeLoopNotesPart({ count: 6, length: 5, durations: [1, 1.5] }),
  //     sortedBy((note: Note) => note.pitch),
  //     transpose(12),
  //     cycle
  //   )
  // );
  const res = [];
  let time = 0;
  let cyclePos = 0;
  let totalSwitches = 0;
  for (let i = 0; i < totalNotes; i++) {
    const note = cycles[cyclePos].next();
    res.push({ ...note, time });
    time += note.duration;
    doWithOdds(() => {
      cyclePos = (cyclePos + 1) % cycles.length;
      totalSwitches += 1;
    })(0.65);
  }
  return res;
};

const makeDrumPart = (): PassageWithChannel => {
  const length = 500;
  const KICK = 36;
  const SNARE = 38;
  const HAT = 42;
  const HAT_OPEN = 46;

  const res: PassageWithChannel = [];
  let time = 0;
  let idx = 0;
  const notes = [
    { pitch: KICK, velocity: 120, odds: 1 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
    { pitch: HAT, velocity: 60, odds: 0.8 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
    { pitch: SNARE, velocity: 90, odds: 1 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
    { pitch: HAT, velocity: 60, odds: 0.8 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
  ];
  const durations = fitIn(16)(
    shuffled([2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 3, 4, 5, 2, 2])
  );
  while (time < length) {
    const nth = nthMod(idx);
    const { pitch: _pitch, velocity, odds } = nth(notes);
    const pitch = _pitch === HAT ? withOdds(HAT_OPEN, HAT)(0.1) : _pitch;
    const duration = nth(durations);
    const adjustedOdds = time % 32 < 16 ? odds ** 2 : odds ** 0.5;
    if (rand() < adjustedOdds) {
      res.push({ pitch, velocity, time, duration, channel: 9 });
    }
    time += duration;
    idx += 1;
  }
  return res;
};

//////////////////////////////////////////////////

const main = () => {
  const melodyPart = pipeline(
    // makeCycleSwitcher(),
    makeRandIntPart({}),
    loopSectionNTimes(0, 5)(0)(12),
    loopSectionNTimes(0, 7)(0)(12),
    loopSectionNTimes(0, 9)(0)(12),
    staccatoRandomly(0.25)(oneTwoOdds(5.5, 0.1, 0.9)),
    accentRandomly(oneOdds(0.2)),
    // staccatoRandomly(0.25)(0.2),
    deleteNotesRandomly(
      sectionOdds(
        xx(9)(() => 8),
        xx(8)(rand)
      )
    ),
    loopSectionNTimes(0, 64)(0)(22),
    shiftNotesRandomly([4, 5, 6])(oneTwoOdds(20, 0, 0.4)),
    shiftNotesRandomly([-1, 1])(oneTwoOdds(24, 0, 0.2)),
    // deleteNotesRandomly(oneTwoOdds(27, 0, 0.3)),
    transpose(60),
    transpose(-12)
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
    passageToJsonSong(320),
    console.log
  );
};

// const t0 = performance.now();
main();
// const t1 = performance.now();
// console.log(t1 - t0);
