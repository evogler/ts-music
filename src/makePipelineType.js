var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var makeSingleArityType = function (size) {
    var types = __spreadArray([], new Array(size), true).map(function (_, idx) { return "T" + idx; });
    var variables = "<".concat(types.join(", "), ">");
    var endPoint = types.at(-1);
    var seriesOfPipes = [];
    for (var i = 0; i < types.length - 1; i++) {
        seriesOfPipes.push("(".concat(types[i].toLowerCase(), ": ").concat(types[i], ") => ").concat(types[i + 1]));
    }
    return "".concat(variables, "( initial: ").concat(types[0], ", ...fns: [ ").concat(seriesOfPipes.join(",\n"), " ]): ").concat(endPoint, ";");
};
var makePipelineType = function (size) {
    var allArities = __spreadArray([], new Array(size), true).map(function (_, idx) { return makeSingleArityType(idx + 2); })
        .join("\n");
    var template = "type Pipeline = {".concat(allArities, "}");
    return template;
};
var arityCount = 30;
console.log(makePipelineType(arityCount));
// tsc makePipelineType.ts; node ./makePipelineType.js  | pbcopy
