'use strict';

var getModelValues = require( '../dispatchers/get-model-values' );

var financialView = {

  init: function() {
    var values = getModelValues.financial();
    this.updateView( values );
  },

  getValues: function() {
    var values = {};
    var $elements = $( '[data-financial]' );

    $elements.each( function() {
      var name = $( this ).attr( 'data-financial' );
      values[ name ] = stringToNum( $( this ).val() );
    });
    return values;
  },

  updateView: function ( values ) {
    var $elements = $( '[data-financial]' );
    $elements.each( function() {
      var $ele = $( this ),
          name = $ele.attr('data-financial'),
          value = values[ name ];

      if ( $ele.prop( 'tagName' ) === 'INPUT' ) {
        $ele.val( value );
      } else {
        $ele.text( value );
      }
    });
  }

};

module.exports = financialView;
