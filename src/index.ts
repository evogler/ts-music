import { pipeline } from "./functional";
import {
  choice,
  fitIn,
  nthMod,
  rand,
  randInt,
  range,
  sample,
  windowMod,
  withOdds,
} from "./math";

type Note = {
  pitch: number;
  time: number;
  duration: number;
  velocity: number;
};

type NoteWithChannel = Note & { channel: number };

type Passage = Note[];

type PassageWithChannel = NoteWithChannel[];

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
  (odds: number) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({
      ...note,
      pitch: note.pitch + withOdds(choice([-1, 1]), 0)(odds),
    }));

const transpose =
  (amount: number) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({ ...note, pitch: note.pitch + amount }));

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

const addPassage =
  (passage1: Passage) =>
  (passage2: Passage): Passage =>
    combinePassages([passage1, passage2]);

const combinePassagesSoloed =
  (barLen = 4) =>
  (passages: Passage[]): Passage => {
    const shouldSoundAtTime =
      (idx: number) =>
      (time: number): boolean => {
        const soloCountNum = Math.floor(time / barLen);
        return soloCountNum % passages.length === idx;
      };
    const res: Passage = [];
    for (let i = 0; i < passages.length; i++) {
      const should = shouldSoundAtTime(i);
      for (const note of passages[i]) {
        if (should(note.time)) {
          res.push(note);
        }
      }
    }
    return sortedByTime(res);
  };

const makeRandIntPart = () => {
  const intCount = randInt(2, 4);
  const intOptions = [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
  const intervals = sample(intCount)(intOptions);
  const pitches = pitchesByRandIntervals({
    intervals,
    window: [0, 24],
    length: 1000,
  });
  const durationOptions = sample(randInt(2, 4))([0.5, 0.5, 1, 1.5, 2]);
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
  const durations = fitIn(8)([4, 2, 2, 2, 3, 2, 2, 2]);
  while (time < length) {
    const nth = nthMod(idx);
    const { pitch: _pitch, velocity, odds } = nth(notes);
    const pitch = _pitch === HAT ? withOdds(HAT_OPEN, HAT)(.1) : _pitch
    const duration = nth(durations);
    if (rand() < odds) {
      res.push({ pitch, velocity, time, duration, channel: 9 });
    }
    time += duration;
    idx += 1;
  }
  return res;
};

//////////////////////////////////////////////////

const main = () => {
  pipeline(
    [
      makeLoopNotesPart({ durations: [1.5, 2.0], count: 3 }),
      makeLoopNotesPart({ durations: [0.5, 0.5, 1], count: 7 }),
      makeLoopNotesPart({ durations: [3.5], count: 3}),
      makeRandIntPart(),
    ],
    combinePassagesSoloed(5.5),
    shiftNotesRandomly(0.1),
    transpose(60),
    addPassage(makeDrumPart()),
    passageToJsonSong(300),
    console.log
  );
};

main();
