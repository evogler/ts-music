import { pipeline } from "./functional";

type Note = {
  pitch: number;
  time: number;
  duration: number;
  velocity: number;
};

type NoteWithChannel = Note & { channel: number };

type Passage = Note[];

type PassageWithChannel = NoteWithChannel[];

type JsonSong = {
  notes: Passage;
  bpm: number;
};

const randInt = (a: number, b: number): number =>
  Math.floor(Math.random() * (b - a + 1)) + a;

const choice = <T>(arr: T[]): T => arr.at(Math.random() * arr.length) as T;

const shuffled = <T>(arr: T[]): T[] => {
  // TODO: performance
  const withIndices = arr.map((x, idx): [number, T] => [idx, x]);
  withIndices.sort((a, b) => b[0] - a[0]);
  return withIndices.map((item) => item[1]);
};

const sample =
  (count: number) =>
  <T>(arr: T[]): T[] => {
    const res: T[] = [];
    const idxs = arr.map((_, idx) => idx);
    while (res.length < count && idxs.length > 0) {
      res.push(arr[idxs.splice(randInt(0, idxs.length - 1), 1)[0]]);
    }
    return res;
  };

const windowMod =
  ([a, b]: [number, number]) =>
  (n: number) =>
    ((n - a) % b) + a;

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

const makeRandIntPart = () => {
  const intCount = randInt(2, 4);
  const intOptions = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
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


//////////////////////////////////////////////////

const main = () => {
  pipeline(
    makeRandIntPart(),
    transpose(60),
    passageToJsonSong(300),
    console.log
  );
};

main();
