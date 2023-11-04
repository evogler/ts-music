import {
  choice,
  OddsFn,
  withOdds,
  rand,
  randInt,
  randStep,
  sample,
  range,
  mod,
  windowMod,
  cumulative,
  _bisect,
} from "./math";

export type Note = {
  pitch: number;
  time: number;
  duration: number;
  velocity: number;
};

export type NoteWithChannel = Note & { channel: number };

export type Passage = Note[];

export type PassageWithChannels = NoteWithChannel[];

export type NoteWithTimeDuration = Note & { timeDuration: number };

export type NoteWithChannelGroups = Note & { channels: number[] };

export const KICK = 36;
export const SNARE = 38;
export const HAT = 42;
export const HAT_OPEN = 46;
export const CRASH = 49;
export const COWBELL = 56;

export const pitchesToPassage = (pitches: number[]): Passage => {
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

export const pitchesAndDurationsToPassage = (
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

export const addChannel =
  (channel: number) =>
  (passage: Passage): PassageWithChannels =>
    passage.map((note) => ({ ...note, channel }));

export const randomizeOctave =
  (octaves: number[]) =>
  (pitches: number[]): number[] =>
    pitches.map((pitch) => (pitch % 12) + choice(octaves));

export const shiftNotesRandomly =
  (intervals: number[]) =>
  (oddsFn: OddsFn) =>
  <T extends Passage>(passage: T): T =>
    passage.map((note) => ({
      ...note,
      pitch: note.pitch + withOdds(choice(intervals), 0)(oddsFn(note).value),
    })) as T;

export const accentRandomly =
  (oddsFn: OddsFn) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({
      ...note,
      velocity: withOdds(
        Math.min(127, note.velocity + 15),
        note.velocity
      )(oddsFn(note).value),
    }));

export const staccatoRandomly =
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

export const deleteNotesRandomly =
  (oddsFn: OddsFn) =>
  (passage: Passage): Passage =>
    passage.filter((note) => rand() > oddsFn(note).value);

export const keepRandomly =
  (oddsFn: OddsFn) =>
  (passage: Passage): Passage =>
    passage.filter((note) => rand() < oddsFn(note).value);

export const transpose =
  (amount: number) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({ ...note, pitch: note.pitch + amount }));

export const offsetTime =
  (offset: number) =>
  (passage: Passage): Passage =>
    passage.map((note) => ({ ...note, time: note.time + offset }));

export const passageToJsonSong =
  (bpm: number) =>
  (passage: Passage): string =>
    JSON.stringify({
      notes: passage,
      bpm,
    });

export const sortByTime = (passage: Passage): void => {
  passage.sort((a: Note, b: Note) => a.time - b.time);
};

export const sortedByTime = (passage: Passage): Passage => {
  const res = [...passage];
  sortByTime(res);
  return res;
};

export const combinePassages = (passages: Passage[]): Passage => {
  const res: Passage = [];
  for (const passage of passages) {
    for (const note of passage) {
      res.push(note);
    }
  }
  return sortedByTime(res);
};

export const exciseSection =
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

export const loopSectionNTimes =
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

export const addPassage =
  (passage1: Passage) =>
  (passage2: Passage): Passage =>
    combinePassages([passage1, passage2]);

export const combinePassagesSoloed =
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

export const randomSections =
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

export const addTimeDurations = (passage: Passage): NoteWithTimeDuration[] => {
  const res = [];
  for (let i = 0; i < passage.length - 1; i++) {
    const note = passage[i];
    const note2 = passage[i + 1];
    const timeDuration = note2.time - note.time;
    res.push({ ...note, timeDuration });
  }
  return res;
};

export const transposeByChannel =
  (channelMap: Record<number, number>) =>
  (passage: PassageWithChannels): PassageWithChannels => {
    return passage.map((note) => ({
      ...note,
      pitch: note.pitch + (channelMap[note.channel] ?? 0),
    }));
  };

export const flattenChannels = <T extends Note>(
  passage: (T & { channels: number[] })[]
): (T & { channel: number })[] =>
  passage.reduce<(T & { channel: number })[]>(
    (acc, noteC) => [
      ...acc,
      ...noteC.channels.map((channel) => {
        const { channels, ...rest } = noteC;
        return { ...rest, channel } as T & { channel: number } & Partial<{
            channels: number[];
          }>;
      }),
    ],
    []
  );

export const experimentalPitchToChord = (passage: Passage): Passage => {
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

export const toScale =
  (scale: number[]) =>
  (passage: Passage): Passage => {
    const res: Passage = [];
    for (const note of passage) {
      let { pitch } = note;
      while (!scale.includes(mod(12)(pitch))) {
        pitch += 1;
      }
      res.push({ ...note, pitch });
    }
    return res;
  };

export const pitchesByRandIntervals = ({
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

export const sectionAtTime = (sectionLengths: number[]) => {
  const cums = cumulative(sectionLengths);
  const __bisect = _bisect(cums);
  const loopLen = cums.at(-1) as number;
  return (note: Note): number => __bisect(note.time % loopLen);
};

export const velocityArc =
  (velocityFn: <T extends { time: number }>(note: T) => T) =>
  <U extends Passage>(passage: U): U => {
    return passage;
  };
