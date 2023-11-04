import { take, cycle, Cycle, xx } from "./functional";
import {
  choice,
  doWithOdds,
  fitIn,
  localShuffled,
  nthMod,
  oneOdds,
  rand,
  randInt,
  randRange,
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
  HAT,
  HAT_OPEN,
  KICK,
  SNARE,
  addTimeDurations,
  flattenChannels,
  pitchesAndDurationsToPassage,
  pitchesByRandIntervals,
  CRASH,
  NoteWithChannel,
  NoteWithChannelGroups,
  shiftNotesRandomly,
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
  // const pitches = [COWBELL, KICK, SNARE, HAT];
  const pitches = [CRASH];
  const channel = 9;
  while (time < totalLength) {
    for (const pitch of pitches) {
      res.push({ time, pitch, duration, velocity, channel });
    }
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
    { pitch: HAT, velocity: 60, odds: 0.8 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
    { pitch: HAT, velocity: 60, odds: 0.8 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
    { pitch: SNARE, velocity: 90, odds: 1 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
    { pitch: HAT, velocity: 60, odds: 0.8 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
    { pitch: HAT, velocity: 60, odds: 0.8 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
    { pitch: HAT, velocity: 60, odds: 0.8 },
    { pitch: HAT, velocity: 20, odds: 0.3 },
  ];
  const durations = fitIn(16)(
    shuffled(
      [
        2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 3, 4, 5, 2, 2,
        2, 2, 2, 3, 4, 5, 2, 2,
      ].map((n) => n + 3)
    )
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

export const makeAddingAndSubtractingPart = ({
  durs = [],
}: {
  durs?: number[];
}): PassageWithChannels => {
  // XXX: relative vs absolute time not accounted for in types
  const numberOfSteps = 1240;
  const minCellSize = 1;
  const maxCellSize = 2;
  const startCellSize = 2;
  const changeOdds = 0.1;

  const randNote = (): NoteWithChannelGroups => {
    const time = choice(
      durs.length > 0
        ? durs
        : [
            0.125,
            0.125,
            0.125,
            0.125,
            0.5,
            0.5,
            1,
            1.5,
            randRange(0.25, 1.0),
            randRange(0.25, 1.0),
            randRange(0.25, 1.0),
            randRange(0.25, 1.0),
            randRange(0.5, 1.5),
          ]
    );
    const duration = choice([time, time, 0.25]);
    return {
      channels: sample(randInt(1, 4))(range(8)),
      // channels: sample(randInt(1, 3))([0, 2, 4]),
      duration,
      pitch: randInt(0, 24),
      time,
      velocity: 70,
    };
  };

  const absolutizeTimes =
    (startTime = 0) =>
    <T extends Passage>(passage: T): T => {
      let time = startTime;
      const res = [];
      for (const note of passage) {
        res.push({ ...note, time });
        time += note.time;
      }
      return res as T;
    };

  type Step = NoteWithChannelGroups[];
  const firstStep = xx(startCellSize)(randNote);
  const steps: Step[] = [firstStep];

  const nextStep = (lastStep: Step): Step => {
    const newStep = [...lastStep];

    doWithOdds(() => {
      if (newStep.length >= maxCellSize) return;
      const newNotePos = randInt(0, newStep.length - 1);
      const newNote = randNote();
      newStep.splice(newNotePos, 0, newNote);
    })(changeOdds);

    doWithOdds(() => {
      if (newStep.length <= minCellSize) return;
      const deletePos = randInt(0, newStep.length - 1);
      newStep.splice(deletePos, 1);
    })(changeOdds);

    return newStep;
  };

  for (let step = 1; step < numberOfSteps; step++) {
    steps.push(nextStep(steps.at(-1) as Step));
  }

  const res = pipeline(
    // shuffled(steps).flat(1),
    steps,
    localShuffled(20),
    // shuffled,
    (_) => _.flat(1),
    absolutizeTimes(0),
    shiftNotesRandomly([-3, -2, -1, 1, 2, 3])(oneOdds(0.1)),
    flattenChannels
  );
  // console.log(res);
  return res;
  // return [];
};
