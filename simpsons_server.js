const fs = require('fs');
const http = require('http');
const processVideo = require('./jitter');

function getFrame(season, episode, index, cb) {
  fs.readFile(`${season}/${episode}/${index}.txt`, 'utf8', (err, data) => {
    if (data) {
      cb(null, data);
    } else {
      cb(err);
    }
  });
}

http.createServer(function(request, response) {
  response.setHeader('Transfer-Encoding', 'chunked');
  response.write('\033[200B');
  response.write('\033[2H');

  const season = '07';
  const episode = '07';
  const path = `${season}/${episode}`;

  function loop(index) {
    getFrame(season, episode, index, (err, frame) => {
      if (frame) {
        response.write('\033[2H');
        response.write(frame);
        setTimeout(loop, 66, index + 1);
      } else {
        response.end('It went great || I couldn\'t make the frame in time.\n');
      }
    });
  }

  fs.stat(path, (err, stats) => {
    // assume if theres a folder its got good files. no doubt.
    if (stats) {
      loop(1);
    } else {
      response.write('hold on... firing up the callback cannon\n\n');
      processVideo(episode, season, () => setTimeout(loop, 1000, 1));
    }
  });

}).listen(3003);
