const fs = require('fs');
const spawn = require('child_process').spawn;
const ImageToAscii = require('image-to-ascii');

const ROOT_FOLDER = '/data/simpsons';

function processVideo(season, episode, onStart) {
  fs.mkdir(`${ROOT_FOLDER}/${season}`, () => {
    const framePath = `${ROOT_FOLDER}/${season}/${episode}`;
    fs.mkdir(framePath, () => {
      const ffmpegArgs = [
        '-i', `${ROOT_FOLDER}/source/${season}${episode}.mp4`,
        '-vf', 'fps=15',
        '-threads', '1',
        `${framePath}/%d.png`
      ];

      spawn('ffmpeg', ffmpegArgs);

      setTimeout(() => {
        (function asciiLoop(index) {
          const filename = `${index}.png`;
          const imagePath = `${framePath}/${filename}`;
          const options = {
            path: imagePath,
            pxWidth: 1,
            size: {
              width: 88,
              height: 40
            }
          };

          ImageToAscii(options, (err, data) => {
            if (err) throw err;
            const asciiFilename = filename.replace('png', 'txt');
            fs.writeFile(`${framePath}/${asciiFilename}`, data, (err) => {
              if (err) throw err;
              asciiLoop(index + 1);
            });
          });
        })(1);

        setTimeout(onStart, 3000);
      }, 1000);
    });
  });
}

module.exports = processVideo;
