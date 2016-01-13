'use strict';

var stringToNum = require( '../utils/handle-string-input' );
var queryHandler = require( '../utils/query-handler' );

var getViewValues = {

  init: function( apiValues ) {
    return $.extend( this.inputs(), this.url(), apiValues );
  },

  getPrivateLoans: function( values ) {
    var $privateLoans = $( '[data-private-loan]' );
    values.privateLoanMulti = [];
    $privateLoans.each( function() {
      var $ele = $( this ),
          $fields = $ele.find( '[data-private-loan_key]' ),
          loanObject = { amount: 0, rate: 0, deferPeriod: 0 };
      $fields.each( function() {
        var key = $( this ).attr( '[data-private-loan_key]' ),
            value = $( this ).val();
        loanObject[key] = value;
      } );
      loanObject.amount += loanObject.fees;
      delete loanObject.fees;
      values.privateLoanMulti.push( loanObject );
    } );
    return values;
  },

  inputs: function() {
    var values = {};
    var $elements = $( '[data-financial]' );

    $elements.each( function() {
      var name = $( this ).attr( 'data-financial' );
      values[name] = stringToNum( $( this ).val() ) || 0;
    } );

    values = this.getPrivateLoans( values );
    return values;
  },

  url: function() {
    var urlValues;
    if ( location.search !== '' ) {
      urlValues = queryHandler( location.search );
    }
    return urlValues;
  }

};

module.exports = getViewValues;
