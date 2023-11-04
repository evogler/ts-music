var tryOne = function () {
    var options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var intervals = [2, 3];
    var res = [0];
    var looped = false;
    var _loop_1 = function () {
        var last = res.at(-1);
        var nextOptions = intervals
            .map(function (n) { return (n + last) % 12; })
            .filter(function (n) { return options.indexOf(n) > -1; });
        if (nextOptions.length === 0) {
            return { value: res };
        }
        var nextNote = nextOptions.at(Math.random() * nextOptions.length);
        var pos = options.indexOf(nextNote);
        options.splice(pos, 1);
        res.push(nextNote);
        if (options.length === 0 && !looped) {
            options.push(0);
        }
    };
    while (true) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
};
var best = [];
var counter = 0;
while (best.length < 13) {
    var one = tryOne();
    counter += 1;
    if (one.length > best.length) {
        console.log(counter, one.join(', '));
        best = one;
    }
}
