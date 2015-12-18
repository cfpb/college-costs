/**
 * Turns a string into a number.
 * Assumes each number in the string should be preserved (unlike parseInt)
 * Assumes the first instance of a decimal point is the intended one
 * @param  {string} numberString  A string representing a number
 * @returns {number} The assumed numeric value of numberString
 */

'use strict';

function handleStringInput( numberString ) {
  var signMaker = 1,
      minusPosition = numberString.indexOf( numberString.match( '-' ) ),
      digitPosition = numberString.indexOf( numberString.match( /\d/ ) );

  // If a '-' appears before the first digit, we assume numberString is negative
  if ( numberString.indexOf( numberString.match( '-' ) ) !== -1 && minusPosition < digitPosition ) {
    signMaker = -1;
  }

  // Strip non-numeric values, maintaining periods
  numberString = numberString.replace( /[^0-9\.]+/g, '' );

  // Strip any periods after the first
  function replaceCommas( match, offset, full ) {
    if ( offset === full.indexOf( '.' ) ) {
      return '.';
    }
    return '';
  }
  numberString = numberString.replace( /\./g, replaceCommas );

  // Get number value of string, then multiply by signMaker and return
  return Number( numberString ) * signMaker;

}

module.exports = handleStringInput;