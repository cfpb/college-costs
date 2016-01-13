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
    'iped', 'pid', 'oid', 'tuit', 'hous', 'book', 'tran', 'othr',
    'pelg', 'schg', 'stag',  'othg', 'ta', 'mta', 'gib', 'fam',
    'wkst', 'parl', 'perl', 'subl', 'unsl', 'ppl', 'gpl', 'prvl',
    'prvi', 'insl', 'insi', 'sav'
  ];
  var keyMaps = {
    iped: 'collegeID',
    pid:  'programID',
    oid:  'offerID',
    tuit: 'tuitionFees',
    hous: 'roomBoard',
    book: 'books',
    tran: 'transportation',
    othr: 'otherExpenses',
    pelg: 'pell',
    schg: 'scholarships',
    stag: 'state529plan',
    othg: '',
    ta:   '',
    mta:  '',
    gib:  '',
    fam:  'family',
    wkst: 'workstudy'
    parl: '',
    perl: 'perkins',
    subl: 'staffSubsidized',
    unsl: 'staffUnsubsidized',
    ppl:  'parentplus',
    gpl:  'gradplus',
    prvl: 'privateLoan',
    prvi: 'privateLoanRate',
    insl: 'institutionalLoan',
    insi: 'institutionalLoanRate',
    sav:  'savings'
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
