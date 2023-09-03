import { take, cycle, Cycle, xx } from "./functional";
import {
  choice,
  doWithOdds,
  fitIn,
  nthMod,
  rand,
  randInt,
  range,
  sample,
  shuffled,
  withOdds,
} from "./math";
import {
  Passage,
  PassageWithChannels,
  Note,
  NoteWithTimeDuration,
  COWBELL,
  HAT,
  HAT_OPEN,
  KICK,
  SNARE,
  addTimeDurations,
  flattenChannels,
  pitchesAndDurationsToPassage,
  pitchesByRandIntervals,
} from "./musicBuildingBlocks";
import { pipeline } from "./pipeline";

export const makeRandIntPart = ({ window = [0, 36] as [number, number] }) => {
  const intCount = randInt(3, 4);
  // const intOptions = [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
  const intOptions = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
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
  const part = pitchesAndDurationsToPassage(pitches, durations);
  const partWithStaccato = part.map((note) => ({
    ...note,
    duration: withOdds(0.25, note.duration)(0.5),
  }));
  return partWithStaccato;
};

export const makeLoopNotesPart = ({
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

export const makeCycleSwitcher = (): PassageWithChannels => {
  const totalNotes = 1500;

  const addRandomChannelOrder = <T extends Note>(
    note: T
  ): T & { channels: number[] } => ({
    ...note,
    channels: sample(9)(range(0, 8 + 1)),
  });

  const partFn = () =>
    pipeline(
      makeRandIntPart({ window: [-12, 24] }),
      // toScale([0, 2, 3, 5, 7, 10]),
      addTimeDurations,
      take(randInt(5, 7)),
      (x) => x.map(addRandomChannelOrder),
      cycle
    );
  const cycles: Cycle<NoteWithTimeDuration & { channels: number[] }>[] =
    xx(25)(partFn);

  let res = [];
  let time = 0;
  let cyclePos = 0;
  let totalSwitches = 0;
  for (let i = 0; i < totalNotes; i++) {
    const note = cycles[cyclePos].next();
    res.push({ ...note, time });
    time += note.timeDuration;
    doWithOdds(() => {
      cyclePos = (cyclePos + 1) % cycles.length;
      totalSwitches += 1;
      // })(time % 32 < 16 ? 0 : 0.5);
    })(0.2);
  }
  res = res.map((note) => ({
    ...note,
    // channels: note.channels.slice(0, 1 + Math.floor((note.time / 8) % 64)),
    channels: note.channels.slice(0, randInt(1, 8)),
  }));
  res = flattenChannels(res);
  return res;
};

export const makeHitsPart = (
  sectionLengths: number[],
  totalLength: number,
  startTime = 0
): PassageWithChannels => {
  const res: PassageWithChannels = [];
  let time = startTime;
  const sectionLengthsCycle = cycle(sectionLengths);
  const velocity = 120;
  const duration = 0.5;
  const pitch = COWBELL;
  const channel = 9;
  while (time < totalLength) {
    res.push({ time, pitch, duration, velocity, channel });
    time += sectionLengthsCycle.next();
  }
  return res;
};

export const makeDrumPart = (): PassageWithChannels => {
  const length = 500;

  const res: PassageWithChannels = [];
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
    shuffled([2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 3, 4, 5, 2, 2].map((n) => n - 1))
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
