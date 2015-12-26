'use strict';

var stringToNum = require( '../utils/handle-string-input' );
var queryHandler = require( '../utils/query-handler' );

var getViewValues = {

  init: function() {
    return $.extend( this.inputs(), this.url() );
  },

  inputs: function() {
    var values = {};
    var $elements = $( '[data-financial]' );

    $elements.each( function() {
      var name = $( this ).attr( 'data-financial' );
      values[name] = stringToNum( $( this ).val() ) || 0;
    } );
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
