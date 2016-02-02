var http = require('http');
var exec = require('child_process').exec;
var ascii = require('./ascii');
var fs = require('fs');

var delimiter = '________\n';
var starWarsFrames = fs.readFileSync('sw1.txt', 'utf8').split(delimiter);

http.createServer(function(request, response) {
  response.setHeader('Transfer-Encoding', 'chunked');
  response.write('\033[200B');
  response.write('\033[2J');
  setTimeout(ascii, 500, response, starWarsFrames.slice(), function(text) {
    response.end(text);
  });
}).listen(3002);
