const tryOne = (): number[] => {
  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const intervals = [2, 3];
  const res = [0];
  let looped = false;
  while (true) {
    const last = res.at(-1) as number;
    const nextOptions = intervals
      .map((n) => (n + last) % 12)
      .filter((n) => options.indexOf(n) > -1);
    if (nextOptions.length === 0) {
      return res;
    }
    const nextNote = nextOptions.at(Math.random() * nextOptions.length) as number;
    const pos = options.indexOf(nextNote);
    options.splice(pos, 1);
    res.push(nextNote);
    if (options.length === 0 && !looped) {
      options.push(0);
    }
  }
};

let best = [];
let counter = 0;
while (best.length < 13) {
  const one = tryOne();
  counter += 1;
  if (one.length > best.length) {
    console.log(counter, one.join(', '));
    best = one;
  }
}
