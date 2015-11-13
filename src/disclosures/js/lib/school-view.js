/**
 * Creates an object which represents a model of financial data
 * No parameters or returns.
 */


'use strict';

var $ = require( 'jquery' ),
    stringToNum = require( './handle-string-input.js'),
    formatUSD = require( 'format-usd' );

var SchoolView = function() {
  /* Dev Note: We may want to filter the getValues method by
   * creating a list of "acceptable" form fields, but I think
   * we'll be fine just using .val(), since that only works on
   * form fields, and we'll want all the form fields each
   * time. But this may need to get more complex.
   */
  this.getValues = function() {
    var values = {},
        $elements = $( '[data-financial]' );

    $elements.each( function() {
      var name = $( this ).attr( 'data-financial' );
      values[ name ] = stringToNum( $( this ).val() );
    })

    return values;
  }

  this.updateView = function( values ) {
    var $elements = $( '[data-financial]' );
    $elements.each( function() {
      var $ele = $( this ),
          name = $ele.attr('data-financial'),
          value = formatUSD( values[ name ], { decimalPlaces: 0 } );

      if ( $ele.prop( 'tagName' ) === 'INPUT' ) {
        $ele.val( value );
      }
      else {
        $ele.text( value );
      }
    });
  }

};

module.exports = SchoolView;