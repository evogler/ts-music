type Pipeline = {
  <A, B>(initial: A, ...fns: [(a: A) => B]): B;
  <A, B, C>(initial: A, ...fns: [(a: A) => B, (b: B) => C]): C;
  <A, B, C, D>(initial: A, ...fns: [(a: A) => B, (b: B) => C, (c: C) => D]): D;
  <A, B, C, D, E>(
    initial: A,
    ...fns: [(a: A) => B, (b: B) => C, (c: C) => D, (d: D) => E]
  ): E;
  <A, B, C, D, E, F>(
    initial: A,
    ...fns: [(a: A) => B, (b: B) => C, (c: C) => D, (d: D) => E, (e: E) => F]
  ): F;
  <A, B, C, D, E, F, G>(
    initial: A,
    ...fns: [
      (a: A) => B,
      (b: B) => C,
      (c: C) => D,
      (d: D) => E,
      (e: E) => F,
      (f: F) => G
    ]
  ): G;
  <A, B, C, D, E, F, G, H>(
    initial: A,
    ...fns: [
      (a: A) => B,
      (b: B) => C,
      (c: C) => D,
      (d: D) => E,
      (e: E) => F,
      (f: F) => G,
      (g: G) => H
    ]
  ): H;
  <A, B, C, D, E, F, G, H, I>(
    initial: A,
    ...fns: [
      (a: A) => B,
      (b: B) => C,
      (c: C) => D,
      (d: D) => E,
      (e: E) => F,
      (f: F) => G,
      (g: G) => H,
      (h: H) => I
    ]
  ): I;
  <A, B, C, D, E, F, G, H, I, J>(
    initial: A,
    ...fns: [
      (a: A) => B,
      (b: B) => C,
      (c: C) => D,
      (d: D) => E,
      (e: E) => F,
      (f: F) => G,
      (g: G) => H,
      (h: H) => I,
      (i: I) => J
    ]
  ): J;
};

export const pipeline: Pipeline = (initial: any, ...fns: Function[]) =>
  fns.reduce((value, fn) => fn(value), initial);
