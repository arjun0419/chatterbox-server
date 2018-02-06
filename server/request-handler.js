/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var messageStorage = [{room: 'lobby', text: 'message 0', user: 'USER1'}, {room: 'lobby', text: 'message 1', user: 'USER1'}];

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var headers = defaultCorsHeaders;
headers['Content-Type'] = 'application/json';

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
    
  let {method} = request;


  if (method === 'POST' && request.url === '/classes/messages') {
    
    let body = [];

    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      // BEGINNING OF NEW STUFF
      console.log(body);
      messageStorage.push(JSON.parse(body));
      statusCode = 201;

      response.writeHead(statusCode, headers);

      var data = {};
      data.results = [];
      // console.log('6 ', statusCode);
      if (messageStorage.length > 0) {
        messageStorage.forEach(function(message) {
          data.results.push(message);
        });
      }

      response.end(JSON.stringify(data));
    });

  } else if (method === 'POST' && request.url === '/classes/room') {
    
    let body = [];
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      // BEGINNING OF NEW STUFF
      messageStorage.push(JSON.parse(body));
      statusCode = 201;

      response.writeHead(statusCode, headers);

      var data = {};
      data.results = [];
      if (messageStorage.length > 0) {
        messageStorage.forEach(function(message) {
          data.results.push(message);
        });
      }

      response.end(JSON.stringify(data));
    });
  } else if (method === 'GET' && request.url === '/classes/messages') {
    statusCode = 200;
    response.writeHead(statusCode, headers);

    var data = {};
    data.results = [];
    if (messageStorage.length > 0) {
      messageStorage.forEach(function(message) {
        data.results.push(message);
      });
    }

    response.end(JSON.stringify(data));

  } else if (method === 'OPTIONS') {
    statusCode = 200;
    response.writeHead(statusCode, headers);

    response.end(JSON.stringify(data));

  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  }
};

exports.requestHandler = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;
