var request = require('request');
var expect = require('chai').expect;

describe('server', function() {
  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        user: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        user: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        expect(messages[0].user).to.equal('Jono');
        expect(messages[0].text).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      // console.log(response.body);
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  it('should not accept POST requests to /classes/messages when text is empty and should 400', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        user: 'Jono',
        text: ''}
    };

    request(requestParams, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should not accept POST requests to /classes/messages when user is undefined and should 400', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        user: undefined,
        text: 'Do my bidding!'}
    };

    request(requestParams, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should not accept POST requests to /classes/messages when text.length is > 100 and should 400', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        user: 'Jono',
        text: 'askjBFFFFDKJhabdks;hsoqihDHAS;DHAKshdkshdkjba;sDBKJbd;bskdbaksbdk;bKDBSK;Jbas;dkbkjsabDK;BASkdabdjsksajbDIQWOG[Qd'}
    };

    request(requestParams, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
