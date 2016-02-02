var http = require('http');

function play(response, frameString, cb) {
  var rawFrames = frameString.split('\n');
  var frames = [];
  var size = 14;

  for (var i = 0; i < rawFrames.length; i += size) {
    frames.push(rawFrames.slice(i, size + i));
  }

  (function loop(frames) {
    response.write('\033[2J');
    var frameLines = frames.shift();
    var delayLine = parseInt(frameLines.shift(), 10);
    frameLines.unshift('\n');
    response.write(frameLines.join('\n'));
    if (frames.length > 0) {
      setTimeout(loop, delayLine * 100, frames);
    } else {
      cb('\033[2J\n:)\n');
    }
  })(frames)
}

module.exports = play;
