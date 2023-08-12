const makeSingleArityType = (size: number) => {
  const types = [...new Array(size)].map((_, idx) => "T" + idx);
  const variables = `<${types.join(", ")}>`;
  const endPoint = types.at(-1);
  const seriesOfPipes = [];
  for (let i = 0; i < types.length - 1; i++) {
    seriesOfPipes.push(
      `(${types[i].toLowerCase()}: ${types[i]}) => ${types[i + 1]}`
    );
  }
  return `${variables}( initial: ${types[0]}, ...fns: [ ${seriesOfPipes.join(
    ",\n"
  )} ]): ${endPoint};`;
};

const makePipelineType = (size: number) => {
  const allArities = [...new Array(size)]
    .map((_, idx) => makeSingleArityType(idx + 2))
    .join("\n");

  const template = `type Pipeline = {${allArities}}`;
  return template;
};

const arityCount = 30;

console.log(makePipelineType(arityCount));

// tsc makePipelineType.ts; node ./makePipelineType.js  | pbcopy