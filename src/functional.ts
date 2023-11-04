export type Cycle<T> = { next: () => T };

export const cycle = <T>(arr: T[]): Cycle<T> => {
  let pos = 0;
  return {
    next: () => {
      const res = arr[pos];
      pos = (pos + 1) % arr.length;
      return res;
    },
  };
};

export const take =
  (count: number) =>
  <T>(arr: T[]): T[] =>
    arr.slice(0, count);

export const xx =
  (times: number) =>
  <T>(fn: () => T): T[] => {
    const res = [];
    for (let i = 0; i < times; i++) {
      res.push(fn());
    }
    return res;
  };
