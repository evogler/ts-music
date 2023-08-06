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
  <A, B, C, D, E, F, G, H, I, J, K>(
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
      (i: I) => J,
      (j: J) => K,
    ]
  ): K;
  <A, B, C, D, E, F, G, H, I, J, K, L>(
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
      (i: I) => J,
      (j: J) => K,
      (k: K) => L,
    ]
  ): L;
  <A, B, C, D, E, F, G, H, I, J, K, L, M>(
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
      (i: I) => J,
      (j: J) => K,
      (k: K) => L,
      (l: L) => M,
    ]
  ): M;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
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
      (i: I) => J,
      (j: J) => K,
      (k: K) => L,
      (l: L) => M,
      (m: M) => N,
    ]
  ): N;
};

export const pipeline: Pipeline = (initial: any, ...fns: Function[]) =>
  fns.reduce((value, fn) => fn(value), initial);
