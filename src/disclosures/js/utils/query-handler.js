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
    'pelg', 'schg', 'stag', 'othg', 'mta', 'gib', 'fam', 'wkst', 'parl',
    'perl', 'subl', 'unsl', 'ppl', 'gpl', 'prvl', 'prvi', 'insl', 'insi', 'sav'
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
    schg: 'schoolGrants',
    stag: 'stateGrants',
    othg: 'otherScholarships',
    mta:  'militaryTuitionAssistance',
    gib:  'GIBill',
    fam:  'family',
    wkst: 'workstudy',
    parl: 'parentLoan',
    perl: 'perkins',
    subl: 'directSubsidized',
    unsl: 'directUnsubsidized',
    ppl:  'parentPlus',
    gpl:  'gradPlus',
    prvl: 'privateLoan',
    prvi: 'privateLoanRate',
    insl: 'institutionalLoan',
    insi: 'institutionalLoanRate'
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
      parameters[key] = value || 0;
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
  // add parent loan to family contributions
  valuePairs.family += valuePairs.parentLoan;
  // add parentPLUS to family contributions, zero parentPLUS
  valuePairs.family += valuePairs.parentPlus;
  valuePairs.parentPlus = 0;
  return valuePairs;
}

module.exports = queryHandler;
