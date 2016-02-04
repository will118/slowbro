const fs = require('fs');
const http = require('http');
const processVideo = require('./processor');

function getFrame(season, episode, index, cb) {
  fs.readFile(`${season}/${episode}/${index}.txt`, 'utf8', (err, data) => {
    if (data) {
      cb(null, data);
    } else {
      cb(err);
    }
  });
}

function returnAvailableEpisodes(response) {
  fs.readdir('source', (err, files) => {
    const episodes = files.map(x => x.replace('.mp4', ''));
    episodes.sort();
    response.write('Available episodes:\n\n');
    response.write(episodes.join(', ') + '\n\n');
    response.end('e.g. crap.tech/simpsons/07/07\n');
  });
}

http.createServer(function(request, response) {
  response.setHeader('Transfer-Encoding', 'chunked');
  response.write('\033[2J');
  response.write('\033[200B');
  response.write('\033[2H');

  const urlNumbers = request.url.match(/(\d+)\/(\d+)/);

  if (!urlNumbers) return returnAvailableEpisodes(response);

  const season = urlNumbers[1];
  const episode = urlNumbers[2];
  const sourceFile = `source/${season}${episode}.mp4`;

  fs.stat(sourceFile, (err, sourceExists) => {
    if (!sourceExists) {
      returnAvailableEpisodes(response);
    } else {
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
          response.write('hold on... charging up the callback cannon\n\n');
          processVideo(season, episode, () => loop(1));
        }
      });
    }
  });
}).listen(3003);
