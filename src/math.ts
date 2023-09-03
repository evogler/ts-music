import { Note, sectionAtTime } from "./musicBuildingBlocks";

export type Odds = { _type: "odds"; value: number };

export type OddsFn = (note: Note) => Odds;

export const rand = Math.random;

export const randStep = (a: number, b: number, c: number): number =>
  Math.floor(rand() * ((b - a) / c + 1)) * c + a;

export const randInt = (a: number, b: number): number => randStep(a, b, 1);

export const choice = <T>(arr: T[]): T => arr.at(rand() * arr.length) as T;

export const shuffled = <T>(arr: T[]): T[] => {
  // TODO: performance
  const withIndices = arr.map((x): [number, T] => [rand(), x]);
  withIndices.sort((a, b) => b[0] - a[0]);
  return withIndices.map((item) => item[1]);
};

export const sample =
  (count: number) =>
  <T>(arr: T[]): T[] => {
    const res: T[] = [];
    const idxs = arr.map((_, idx) => idx);
    while (res.length < count && idxs.length > 0) {
      res.push(arr[idxs.splice(randInt(0, idxs.length - 1), 1)[0]]);
    }
    return res;
  };

export const withOdds =
  <T>(ifSo: T, ifNot: T) =>
  (odds: number) =>
    rand() < odds ? ifSo : ifNot;

export const doWithOdds =
  <T>(fn: () => unknown) =>
  (odds: number) => {
    if (rand() < odds) {
      fn();
    }
  };

export const mod = (divisor: number) => (dividend: number) =>
  ((dividend % divisor) + divisor) % divisor;

export const windowMod =
  ([a, b]: [number, number]) =>
  (n: number) =>
    mod(b - a)(n) + a;

export const range = (a: number, b?: number): number[] => {
  if (b === undefined) return range(0, a);
  return [...new Array(b - a)].map((_, idx) => idx + a);
};

export const nthMod =
  (idx: number) =>
  <T>(arr: T[]): T =>
    arr[idx % arr.length];

export const fitIn =
  (overallLength: number) =>
  (durs: number[]): number[] => {
    const sum = durs.reduce((n, acc) => n + acc, 0);
    const ratio = overallLength / sum;
    return durs.map((n) => n * ratio);
  };

export const comp = <T>(a: T, b: T): number => {
  if (b < a) return 1;
  if (a < b) return -1;
  return 0;
};

export const sortedBy =
  <T>(pred: (a: T) => unknown) =>
  (arr: T[]): T[] => {
    const res = [...arr];
    res.sort((a, b) => comp(pred(a), pred(b)));
    return res;
  };

export const _bisect =
  (arr: number[]) =>
  (n: number): number => {
    if (n < arr[0]) return -1;
    if (n > arr.slice(-1)[0]) return arr.length - 1;
    let a = 0;
    let b = arr.length;
    while (a < b) {
      const m = Math.floor((a + b) / 2);
      const [a0, a1] = [arr[m], arr[m + 1]];
      if (n >= a0 && n < a1) return m;
      if (n > a0) a = m + 1;
      else b = m;
    }
    return a;
  };

export const cumulative = (arr: number[], start = 0): number[] => {
  const res = [start];
  for (const n of arr) {
    res.push(n + (res.at(-1) as number));
  }
  return res;
};

export const intervals = (arr: number[]): number[] => {
  const res = [];
  for (let i = 0; i < arr.length - 1; i++) {
    res.push(arr[i + 1] - arr[i]);
  }
  return res;
};

export const oddsType = (odds: number): Odds => ({ _type: "odds", value: odds });

export const oneOdds =
  (odds: number): OddsFn =>
  () =>
    oddsType(odds);

export const oneTwoOdds =
  (segmentLength: number, firstOdds: number, secondOdds: number): OddsFn =>
  (note: Note) =>
    oddsType(
      note.time % (2 * segmentLength) < segmentLength ? firstOdds : secondOdds
    );

export const sectionOdds = (sectionLengths: number[], odds: number[]): OddsFn => {
  const getSection = sectionAtTime(sectionLengths);
  return (note: Note) => oddsType(odds[getSection(note)]);
};
