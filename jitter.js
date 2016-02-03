const fs = require('fs');
const spawn = require('child_process').spawn;
const ImageToAscii = require('image-to-ascii');

function processVideo(season, episode, onStart) {
  fs.mkdir(season, () => {
    const framePath = `${season}/${episode}`;
    fs.mkdir(framePath, () => {
      const ffmpegArgs = [
        '-i', `source/${season}${episode}.mp4`,
        '-vf', 'fps=15',
        `${framePath}/%d.png`
      ];

      spawn('ffmpeg', ffmpegArgs);

      onStart();

      fs.watch(framePath, (event, filename) => {
        if (filename && filename.endsWith('png')) {
          ImageToAscii(`${__dirname}/${framePath}/${filename}`, (err, data) => {
            const asciiFilename = filename.replace('png', 'txt');
            fs.writeFile(`${framePath}/${asciiFilename}`, data, (err) => {
              if (err) throw err;
            });
          });
        }
      });
    });
  });
}

module.exports = processVideo;
