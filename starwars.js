var http = require('http');
var ascii = require('./ascii');
var fs = require('fs');

var starWarsFrameString = fs.readFileSync('sw1.txt', 'utf8');

http.createServer(function(request, response) {
  response.setHeader('Transfer-Encoding', 'chunked');
  response.write('\033[200B');
  response.write('\033[2J');
  setTimeout(ascii, 500, response, starWarsFrameString, function(text) {
    response.end(text);
  });
}).listen(3002);
