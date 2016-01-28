'use strict';

/**
 * Formats a raw URL to be used in an href attribute.
 * The raw URL may or may not start with "http://" or "https://"
 * @param  {string} url The raw URL
 * @returns {string} The formated URL
 */

function formatSchoolURL( url ) {
  var formattedURL;
  if ( url && ( /^https?:\/\// ).test( url ) ) {
    formattedURL = url;
  } else if ( url ) {
    formattedURL = 'http://' + url;
  } else {
    formattedURL = false;
  }
  return formattedURL;
}

module.exports = formatSchoolURL;
