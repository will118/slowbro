var http = require('http');

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

  setTimeout(function() {
    response.write('<h2 class="first">Welcome</h2>');
  }, 1000);

  setTimeout(function() {
    response.write('<style> .first { display: none } </style>');
  }, 1500);

  setTimeout(function() {
    response.write('<h2 class="second">' + 'to' + '</h2>');
  }, 2000);

  setTimeout(function() {
    response.write('<style> .second { display: none } </style>');
  }, 2500);

  setTimeout(function() {
    response.write('<h1>' + 'CRAPTECH' + '</h1>');
    response.end('</body></html>');
  }, 3000);
}).listen(3001);
