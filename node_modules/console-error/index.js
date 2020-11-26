const data = {
 icon: '✘',

 redBg: "\x1b[41m",
 redFg: "\x1b[31m",
 whiteFg: "\x1b[37m",

 reset: "\x1b[0m",
 reverse: "\x1b[7m"
};
console.old_error = console.error;
console.error = function() {
 console.old_error(data.redBg + data.whiteFg, data.icon, data.reset, data.redFg, ...arguments, data.reset);
};
module.exports = console.error ;
