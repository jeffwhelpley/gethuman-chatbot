'use strict'

// should this just be declared in FB bot module?
// const token = process.env.FB_PAGE_ACCESS_TOKEN



// need to examine the request coming from Facebook for what distinguishes it
// basically returns False now
function isHandlerForRequest(platformRequestContext) {
  var object = platformRequestContext.userRequest.object || '';
  return (object === 'page') ? true : false;
}

function getResponsePayload() {

}

function sendResponseToPlatform() {

}


module.exports = {
  getResponsePayload: getResponsePayload,
  sendResponseToPlatform: sendResponseToPlatform,
  isHandlerForRequest: isHandlerForRequest
}