'use strict';

var getModelValues = require( '../dispatchers/get-model-values' );
var publish = require( '../dispatchers/publish-update' );
var stringToNum = require( '../utils/handle-string-input' );

var financialView = {
  $elements: $( '[data-financial]' ),
  $review: $( '[data-section="review"]' ),
  $privateLoans: $( '[data-private-loan]' ),
  $addPrivateButton: $( '.private-loans_add-btn' ),
  $privateContainer: $( '.private-loans' ),
  privateLoanKeys: [ 'amount', 'fees', 'rate', 'deferPeriod' ],

  init: function() {
    var values = getModelValues.financial();
    this.updateView( values );
    this.keyupListener();
    this.addPrivateListener();
    this.removePrivateListener();
    this.resetPrivateLoanView();
  },

  setPrivateLoans: function( values ) {
    this.$privateLoans.each( function() {
      var index = $( this ).index(),
          $ele = $( this ),
          $fields = $ele.find( '[data-private-loan_key]' );

      $fields.each( function() {
        var key = $( this ).attr( 'data-private-loan_key' ),
            val = values.privateLoanMulti[index][key];
        $( this ).val( val );
      } );
    } );
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

    // handle private loans separately
    this.setPrivateLoans( values );
  },

  addPrivateListener: function() {
    this.$addPrivateButton.click( function() {
      var $container = $( '.private-loans' ),
          $ele = $container.find( '.private-loans_loan:first' );
      $ele.clone().insertAfter( $container.find( '.private-loans_loan:last' ) );
      $container.find( '.private-loans_loan:last .aid-form_input' ).val( '0' );
      publish.addPrivateLoan();
    } );
  },

  removePrivateListener: function() {
    var buttonClass = '.private-loans_remove-btn';
    this.$privateContainer.on( 'click', buttonClass, function() {
      var $ele = $( this ).closest( '.private-loans_loan' );
      $ele.remove();
    } );
  },

  resetPrivateLoanView: function() {
    // remove the 2 excess private loans (3 exist initially as a NoJS fallback)
    this.$privateLoans.each( function() {
      var index = $( this ).index();
      if ( index > 0 ) {
        $( this ).remove();
        publish.dropPrivateLoan( index );
      }
    } );
  },

  keyupListener: function() {
    this.$review.on( 'keyup', '[data-financial]', function() {
      this.financialKey = $( this ).attr( 'data-financial' );
      this.keyValue = stringToNum( $( this ).val() );
      if ( typeof $( this ).attr( 'data-private-loan_key' ) !== 'undefined' ) {
        var index = $( this ).closest( '[data-private-loan]' ).index(),
            key = $( this ).attr( 'data-private-loan_key' );
        publish.updatePrivateLoan( index, key, this.keyValue );
      } else {
        publish.financialData( this.financialKey, this.keyValue );
      }
      var values = getModelValues.financial();
      financialView.updateView( values );
    } );
  }

};

module.exports = financialView;
