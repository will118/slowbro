var http = require('http');

function sendChunks(messages, response) {
  (function loop(messages) {
    var msg = messages.shift();
    response.write('<h1>' + msg + '</h1>');
    if (messages.length > 0) {
      setTimeout(loop, 1000, messages);
    } else {
      response.end('</body></html>');
    }
  })(messages);
}

http.createServer(function(request, response) {
  response.setHeader('Content-Type', 'text/html; charset=UTF-8');
  response.setHeader('Transfer-Encoding', 'chunked');

  var html =
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
      '<meta charset="utf-8">' +
      '<title>crap.tech</title>' +
    '</head>' +
    '<body>';

  response.write(html);
  setTimeout(sendChunks, 500, ['WELCOME', 'TO', 'CRAPTECH'], response);
}).listen(3000);
