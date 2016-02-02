var http = require('http');
var fs = require('fs');

var delimiter = '________\n';
var frames = fs.readFileSync('rr.txt', 'utf8').split(delimiter);

function play(response, cb) {
  (function loop(frames) {
    response.write('\033[2J');
    var frame = frames.shift();
    var lines = frame.split('\n');
    var delayLine = parseInt(lines.shift(), 10);
    lines.unshift('\n');
    response.write(lines.join('\n'));
    if (frames.length > 0) {
      setTimeout(loop, delayLine * 100, frames);
    } else {
      cb('\033[2J\n:)\n');
    }
  })(frames.slice())
}

module.exports = play;
