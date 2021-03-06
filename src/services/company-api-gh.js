const Q = require('q');
const request = require('request');
const config = require('../config/config');

/**
 * Find all companies that match given text input
 *
 * @param textInput
 * @returns {*|promise}
 */
function findByText(textInput) {
  var deferred = Q.defer();
  // var url = process.env.API_BASE_URL + '/companies/search';
  var url = config.ghApiBaseUrl + '/companies/search';
  console.log('URL for findAllByText search: ' + url);

  var match = encodeURIComponent(textInput);

  console.log('trying to match user input: ' + match)

  request(url
    + '?match='
    + match,
    function (error, response, body) {
      if (error) {
          deferred.reject(error);
      } else {
          deferred.resolve(JSON.parse(body));
      }
  });
  return deferred.promise;
}

module.exports = {
  findByText: findByText
};