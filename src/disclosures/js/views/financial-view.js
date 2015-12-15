'use strict';

var debounce = require('debounce');
var getModelValues = require( '../dispatchers/get-model-values' );
var publish = require('../dispatchers/publish-update');
var stringToNum = require( '../utils/handle-string-input');

var financialView = {
  $elements: $( '[data-financial]' ),

  init: function() {
    var values = getModelValues.financial();
    this.updateView( values );
    this.keyupListener();
  },

  updateView: function ( values ) {
    this.$elements.each( function() {
      var $ele = $( this ),
          name = $ele.attr('data-financial'),
          value = values[ name ];

      if ( $ele.prop( 'tagName' ) === 'INPUT' ) {
        $ele.val( value );
      } else {
        $ele.text( value );
      }
    });
  },

  keyupListener: function() {
    this.$elements.keyup( function( e ) {
      this.financialKey = $( this ).attr( 'data-financial' );
      this.keyValue = stringToNum( $( this ).val() );
      publish.financialData( this.financialKey, this.keyValue );
      var values = getModelValues.financial();
      financialView.updateView( values );
    });
  }

};

module.exports = financialView;
