'use strict';

/**
 * Handles URL questy string to turn key-value pairs into an object.
 * @param  {string} queryString - The query string of a url (location.search)
 * @returns {object} - An object containing key-value pairs from the query
 */

function queryHandler( queryString ) {
  var valuePairs = {},
      parameters = {},
      stringToNum = require( './handle-string-input.js'),
      numericKeys = [
        'tf', 'rb', 'bk', 'tr', 'oe', 'sc', 'pg', 'sv', 'fm', 'pk', 'ss',
        'su', 'il', 'ir', 'pl', 'pr'
      ],
      keyMaps = {
        'tf' : 'tuitionFees',
        'tb' : 'roomBoard',
        'bk' : 'books',
        'tr' : 'transportation',
        'oe' : 'otherExpenses',
        'sc' : 'scholarships',
        'pg' : 'pell',
        'sv' : 'savings',
        'fm' : 'family',
        'pk' : 'perkins',
        'ss' : 'staffSubsidized',
        'su' : 'staffUnsubsidized',
        'il' : 'instituionalLoan',
        'ir' : 'institutionalLoanRate',
        'pl' : 'privateLoan',
        'pr' : 'privateLoanRate'
      }

  function checkValue( key, value ) {
    var newValue = value;

    if ( numericKeys.indexOf( key ) !== -1 ) {
      newValue = stringToNum( value );
    }

    return newValue;
  }

  function getPairs() {
    var pair,
        regex = /[?&]?([^=]+)=([^&]*)/g;

    queryString.split('+').join(' ');

    while( pair = regex.exec( queryString ) ) {
      var key = decodeURIComponent( pair[ 1 ] ),
          value = decodeURIComponent( pair[ 2 ] );

      value = checkValue( key, value );
      parameters[ key ] = value;
    }
  }

  function remapKeys() {
    for( var key in parameters ) { 

      if ( keyMaps.hasOwnProperty( key ) ) {
        var newKey = keyMaps[ key ];
        valuePairs[ newKey ] = parameters[ key ];
      }
    }
  }

  getPairs();
  remapKeys();
  return valuePairs;
}

module.exports = queryHandler;