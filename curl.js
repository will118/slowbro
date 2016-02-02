var http = require('http');
var exec = require('child_process').exec;

function toiletInvoke(msg, cb) {
  var cmd = 'toilet -w 80 -f mono12 -F metal ' + msg;
  exec(cmd, function(error, stdout, stderr) { cb(stdout); });
}

function toilet(messages, response) {
  (function loop(messages) {
    toiletInvoke(messages.shift(), function(stdout) {
      response.write('\033[2J');
      if (messages.length > 0) {
        response.write(stdout + '\n'.repeat(4));
        setTimeout(loop, 1000, messages);
      } else {
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
          response.end('\033[2J\n:)');
        }, dissolveTimes[dissolveTimes.length - 1] + 100);
      }
    });
  })(messages)
}

http.createServer(function(request, response) {
  response.setHeader('Transfer-Encoding', 'chunked');
  response.write('\033[200B');
  response.write('\033[2J');
  setTimeout(toilet, 500, ['WELCOME', 'TO', 'CRAPTECH'], response);
}).listen(3000);

