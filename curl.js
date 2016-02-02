var http = require('http');
var exec = require('child_process').exec;
var ascii = require('./ascii');
var fs = require('fs');

var delimiter = '________\n';
var frames = fs.readFileSync('rr.txt', 'utf8').split(delimiter);

function toiletInvoke(msg, cb) {
  var cmd = 'toilet -f mono12 -F metal ' + msg;
  exec(cmd, function(error, stdout, stderr) { cb(stdout); });
}

function finalScene(stdout, response) {
  var multiplier = 100;
  var lines = stdout.split('\n');

  lines.forEach(function(line, i) {
    setTimeout(function() {
      response.write(line + '\n')
    }, i * multiplier);
  });

  var dissolveTimes = lines.map(function(line, i) {
    return ((i + 1) * multiplier) + (lines.length + 10) * multiplier;
  });

  dissolveTimes.forEach(function(timeout, i) {
    setTimeout(function() {
      var fragment = lines.slice(0, lines.length - i).join('\n');
      var padding = '\n'.repeat(i + 1);
      response.write('\033[2J' + fragment + padding);
    }, timeout);
  });

  setTimeout(function() {
    ascii(response, frames, function(text) {
      response.end(text);
    });
  }, dissolveTimes[dissolveTimes.length - 1] + 100);
}


function run(messages, response) {
  (function loop(messages) {
    toiletInvoke(messages.shift(), function(stdout) {
      response.write('\033[2J');
      if (messages.length > 0) {
        response.write(stdout + '\n'.repeat(4));
        setTimeout(loop, 1000, messages);
      } else {
        finalScene(stdout, response);
      }
    });
  })(messages)
}


http.createServer(function(request, response) {
  response.setHeader('Transfer-Encoding', 'chunked');
  response.write('\033[200B');
  response.write('\033[2J');
  setTimeout(run, 500, ['WELCOME', 'TO', 'CRAPTECH'], response);
}).listen(3000);
