export const rand = Math.random;

export const randInt = (a: number, b: number): number =>
  Math.floor(rand() * (b - a + 1)) + a;

export const choice = <T>(arr: T[]): T => arr.at(rand() * arr.length) as T;

export const shuffled = <T>(arr: T[]): T[] => {
  // TODO: performance
  const withIndices = arr.map((x, idx): [number, T] => [idx, x]);
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
  <T>(a: T, b: T) =>
  (odds: number) =>
    rand() < odds ? a : b;

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
