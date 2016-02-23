'use strict';

var stringToNum = require( '../utils/handle-string-input' );
var getSchoolValues = require( '../dispatchers/get-school-values' );
var queryHandler = require( '../utils/query-handler' );

var getViewValues = {
  def: 0,

  init: function( apiValues ) {
    return $.extend( this.inputs(), apiValues );
  },

  getPrivateLoans: function( values ) {
    // Note: Only run once, during init()
    var $privateLoans = $( '[data-private-loan]' );
    values.privateLoanMulti = [];
    $privateLoans.each( function() {
      var $ele = $( this ),
          $fields = $ele.find( '[data-private-loan_key]' ),
          loanObject = { amount: 0, totalLoan: 0, rate: 0, deferPeriod: 0 };
      $fields.each( function() {
        var key = $( this ).attr( 'data-private-loan_key' ),
            value = $( this ).val();
        if ( key === 'rate' ) {
          value /= 100;
        }
        loanObject[key] = stringToNum( value );
      } );
      values.privateLoanMulti.push( loanObject );
    } );
    return values;
  },

  inputs: function() {
    // Note: Only run once, during init()
    var values = {};
    var $elements = $( '[data-financial]' );

    $elements.not( '[data-private-loan_key]' ).each( function() {
      var name = $( this ).attr( 'data-financial' );
      values[name] = stringToNum( $( this ).val() ) || 0;
      if ( $( this ).attr( 'data-percentage_value' ) === 'true' ) {
        values[name] /= 100;
      }
    } );

    values = this.getPrivateLoans( values );
    return values;
  },

  /**
   * Get values from URL Offer
   */
  urlOfferHandler: function() {
    var urlValues = this.fromURL();
    this.def = $.Deferred();
    $.when( getSchoolValues.init( urlValues.collegeID, urlValues.programID ) )
      .done( function( schoolValues ) {
        var values = {};
        $.extend( values, schoolValues, urlValues );
        getViewValues.def.resolve( values );
      } );
      return this.def.promise();
  },

  /**
   * Check to see if the URL contains an offer
   */
  urlOfferExists: function() {
    return location.search !== '';
  },

  /**
   * Create object with URL offer data
   */
  fromURL: function() {
    var urlValues;
    urlValues = queryHandler( location.search );
    
    return urlValues;
  }
};

module.exports = getViewValues;
