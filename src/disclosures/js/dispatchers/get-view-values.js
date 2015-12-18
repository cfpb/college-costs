'use strict';

var stringToNum = require( '../utils/handle-string-input');

var getViewValues = {

  inputs: function() {
    var values = {};
    var $elements = $( '[data-financial]' );

    $elements.each( function() {
      var name = $( this ).attr( 'data-financial' );
      values[ name ] = stringToNum( $( this ).val() ) || 0;
    });
    return values;
  }

}

module.exports = getViewValues;
