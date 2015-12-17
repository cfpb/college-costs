'use strict';

var stringToNum = require( './handle-string-input.js' );

/**
 * Handles URL questy string to turn key-value pairs into an object.
 * @param  {string} queryString - The query string of a url (location.search)
 * @returns {object} - An object containing key-value pairs from the query
 */
function queryHandler( queryString ) {
  var valuePairs = {};
  var parameters = {};
  var numericKeys = [
    'tf', 'rb', 'bk', 'tr', 'oe', 'sc', 'pg', 'sv', 'ws', 'fm', 'fl',
    'pk', 'ss', 'su', 'il', 'ir', 'pl', 'pr'
  ];
  var keyMaps = {
    tf : 'tuitionFees',
    rb : 'roomBoard',
    bk : 'books',
    tr : 'transportation',
    oe : 'otherExpenses',
    sc : 'scholarships',
    pg : 'pell',
    sv : 'savings',
    ws : 'workstudy',
    fm : 'family',
    fl : 'state529plan',
    pk : 'perkins',
    ss : 'staffSubsidized',
    su : 'staffUnsubsidized',
    il : 'institutionalLoan',
    ir : 'institutionalLoanRate',
    pl : 'privateLoan',
    pr : 'privateLoanRate'
  };

  function checkValue( key, value ) {
    var newValue = value;

    if ( numericKeys.indexOf( key ) !== -1 ) {
      newValue = stringToNum( value );
    }

    return newValue;
  }

  function getPairs() {
    var pair;
    var regex = /[?&]?([^=]+)=([^&]*)/g;

    queryString.split( '+' ).join( ' ' );

    while ( pair = regex.exec( queryString ) ) {
      var key = decodeURIComponent( pair[1] );
      var value = decodeURIComponent( pair[2] );

      value = checkValue( key, value );
      parameters[key] = value;
    }
  }

  function remapKeys() {
    for ( var key in parameters ) {

      if ( keyMaps.hasOwnProperty( key ) ) {
        var newKey = keyMaps[key];
        valuePairs[newKey] = parameters[key];
      }
    }
  }

  getPairs();
  remapKeys();
  return valuePairs;
}

module.exports = queryHandler;
