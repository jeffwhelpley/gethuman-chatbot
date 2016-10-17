'use strict'

const token = process.env.FB_PAGE_ACCESS_TOKEN
const request = require('request');
const Q = require('q');
const companySearch = require('../api-gh/company.js');
const postSearch = require('../api-gh/post.js');
const preparePayload = require('./messenger-payload.js');

function isHandlerForRequest(context) {
  var object = context.userRequest.object || '';
  return (object === 'page') ? true : false;
}

function getResponsePayload(context) {
  var messaging_events = context.userRequest.entry[0].messaging;

  //send back an immediate 200 response to make FB happy
  // context.finishResponse;

// strange looping behavior here - sending messages back to server, won't stop
  for (let i = 0; i < messaging_events.length; i++) {
    let event = context.userRequest.entry[0].messaging[i]
    let sender = event.sender.id

    if (event.message && event.message.text) {
      let textInput = event.message.text;
      console.log("Text input received from user: " + textInput);
      var payload = {
        raw: {},
        data:  {},
        context: context
      };
      return Q.all([
          postSearch.findByText(textInput),
          companySearch.findByText(textInput)
      ])
      .then(function (postAndCompanySearchResults) {
        console.log('Initial Post and Company searches complete, about to load payload object from search results');
        var posts = postAndCompanySearchResults[0];
        var companies = postAndCompanySearchResults[1];
        if (posts && posts.length) {
          console.log("It's going to be a Posts message return");
          return preparePayload.addPostsToPayload(payload, posts);
        }
        else if (companies && companies.length) {
          console.log("It's going to be a Companies message return");
          return preparePayload.addCompaniesToPayload(payload, companies);
        }
        else {
          console.log("It's going to be a Nothing Found message return");
          return preparePayload.nothingFound(payload);
        }
      });
    }
  }

}





function sendResponseToPlatform(responsePayload) {
  console.log('Hitting the sendResponseToPlatform function with this payload: ' + JSON.stringify(responsePayload));
  var elements = responsePayload.data;
  var event = responsePayload.userRequest.entry[0].messaging[i];
  var sender = event.sender.id;

  // shoot back an immediate Status 200 to let Slack know it's all cool
  responsePayload.context.finishResponse();

// gotta make this a Promise
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: token},
      method: 'POST',
      json: {
          recipient: {id: sender},
          message: {
              "attachment": {
                  "type": "template",
                  "payload": {
                      "template_type": "generic",
                      "elements": elements
                  }
              }
          },
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  });

}


module.exports = {
  getResponsePayload: getResponsePayload,
  sendResponseToPlatform: sendResponseToPlatform,
  isHandlerForRequest: isHandlerForRequest
}