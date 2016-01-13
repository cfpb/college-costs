'use strict';

var getModelValues = require( '../dispatchers/get-model-values' );
var publish = require( '../dispatchers/publish-update' );
var stringToNum = require( '../utils/handle-string-input' );

var financialView = {
  self: this,
  $elements: $( '[data-financial]' ),
  $addPrivateButton: $( '.private-loans_add-btn' ),
  $privateContainer: $( '.private-loans' ),

  init: function() {
    var values = getModelValues.financial();
    this.updateView( values );
    this.keyupListener();
    this.addPrivateListener();
    this.removePrivateListener();
  },

  updateView: function( values ) {
    this.$elements.each( function() {
      var $ele = $( this ),
          name = $ele.attr( 'data-financial' ),
          value = values[name];

      if ( $ele.prop( 'tagName' ) === 'INPUT' ) {
        $ele.val( value );
      } else {
        $ele.text( value );
      }
    } );
  },

  addPrivateListener: function() {
    this.$addPrivateButton.click( function() {
      var $container = $( '.private-loans' ),
          $ele = $container.find( '.private-loans_loan:first' );
      $ele.clone().insertAfter( $container.find( '.private-loans_loan:last' ) );
      $container.find( '.private-loans_loan:last .aid-form_input' ).val( '0' );
    } );
  },

  removePrivateListener: function() {
    var buttonClass = '.private-loans_remove-btn';
    this.$privateContainer.on( 'click', buttonClass, function() {
      var $ele = $( this ).closest( '.private-loans_loan' );
      $ele.remove();
    } );
  },

  keyupListener: function() {
    this.$elements.keyup( function() {
      this.financialKey = $( this ).attr( 'data-financial' );
      this.keyValue = stringToNum( $( this ).val() );
      publish.financialData( this.financialKey, this.keyValue );
      var values = getModelValues.financial();
      financialView.updateView( values );
    } );
  }

};

module.exports = financialView;
