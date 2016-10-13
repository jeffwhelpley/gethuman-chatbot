'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Q = require('q');

// should this just be declared in FB bot module?
// const token = process.env.FB_PAGE_ACCESS_TOKEN
// is this even used?
// const GH_token = process.env.GH_API_ACCESS_TOKEN

function startServer(handlers) {
  var port = process.env.PORT || 3000;
  var app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json())
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(400).send(err.message);
  });

  // test route
  app.get('/', function (req, res) {
    res.status(200).send('Hello world!')
  });

  // hellobot - keep for testing
  app.post('/hello', require('./deprecated/hellobot.js'));
  // dicebot - keep for testing
  app.post('/roll', require('./deprecated/dicebot.js'));



  // for Facebook verification
  app.get('/webhook/', function (req, res) {
    // var context = getContextFromExpressReqRes(req, res);
    // var botHandler = getBotHandler(context);
    // botHandler.verify();

      if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
          res.send(req.query['hub.challenge'])
      }
      res.send('Error, wrong token');
  })

  app.post('/gethuman', handleRequest(handlers));
  app.post('/v3/gethuman', handleRequest(handlers));

  app.listen(port, function () {
    console.log('Fusion bot listening on port ' + port);
  });

  return app;
}

// is unit testable
function handleRequest(handlers) {
  return function (req, res) {

  // put data from the Express req object into our custom context object
  var context = getContextFromExpressReqRes(req, res);

  console.log("Platform request: " + JSON.stringify(context));
  var botHandler = getBotHandler(handlers, context);
  botHandler.getResponsePayload(context)
    .then(function (responsePayload) {
      console.log("About to send a message back to Client: " + JSON.stringify(responsePayload));
      botHandler.sendResponseToPlatform(responsePayload);
    })
    .catch(function (err) {
      botHandler.sendErrorResponse(err, context);
    });
  }
}

// is unit testable
function getBotHandler(handlers, platformRequestContext) {
  // loop through handlers and call handlers[i].isHandlerForRequest(platformRequestContext)

  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i].isHandlerForRequest(platformRequestContext)) {
      console.log("Found a bot to handle request!");
      return handlers[i];
    };
  };

  // else if handler not found, throw error
  throw "Request coming from unrecognized platform";
}

// is unit testable
function getContextFromExpressReqRes(req, res) {
  return {
    userRequest: req.body,
    isTest: !!req.params.istest,
    sendResponse: function (payload) {
      res.send(payload);
    },
    finishResponse: function() {
      res.status(200).end();
    }
  };
}

module.exports = {
  startServer: startServer,
  getBotHandler: getBotHandler,
  getContextFromExpressReqRes: getContextFromExpressReqRes
}
