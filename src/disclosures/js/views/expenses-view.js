'use strict';

var getModelValues = require( '../dispatchers/get-model-values' );
var publish = require( '../dispatchers/publish-update' );
var formatUSD = require( 'format-usd' );

var expensesView = {
  $elements: $( '[data-expenses]' ),
  $reviewAndEvaluate: $( '[data-section="review"], [data-section="evaluate"]' ),
  currentInput: '',

  init: function() {
    this.keyupListener();
  },

  /**
   * Helper function that updates the value or text of an element
   * @param {object} $ele - jQuery object of the element to update
   * @param {number|string} value - The new value
   * @param {Boolean} currency - True if value is to be formatted as currency
   */
  updateElement: function( $ele, value, currency ) {
    if ( currency === true ) {
      value = formatUSD( { amount: value, decimalPlaces: 0 } );
    }
    if ( $ele.attr( 'data-line-item' ) === 'true' ) {

      value = value.replace( /\$/i, '' );
    }
    if ( $ele.prop( 'tagName' ) === 'INPUT' ) {
      $ele.val( value );
    } else {
      $ele.text( value );
    }
  },

  /**
   * Helper function that updates expenses elements
   * @param {object} values - expenses model values
   */
  updateExpenses: function( values ) {
    this.$elements.each( function() {
      var $ele = $( this ),
          name = $ele.attr( 'data-expenses' ),
          currency = true;
      if ( expensesView.currentInput === $( this ).attr( 'id' ) ) {
        currency = false;
      }
      console.log( $ele.attr('data-expenses'), values[name], currency );
      expensesView.updateElement( $ele, values[name], currency );
    } );
  },

  /**
   * Function that updates the view with new values
   * @param {object} values - expense model values
   */
  updateView: function( values ) {
    // handle non-private-loan fields
    this.updateExpenses( values );
  },

  /**
   * Listener function for keyup in financial model INPUT fields
   */
  keyupListener: function() {
    this.$reviewAndEvaluate.on( 'keyup', '[data-expenses]', function() {
      clearTimeout( expensesView.keyupDelay );
      expensesView.currentInput = $( this ).attr( 'id' );
      expensesView.keyupDelay = setTimeout( function() {
        expensesView.inputHandler( expensesView.currentInput );
        expensesView.updateView( getModelValues.expenses() );
      }, 500 );
    } );
  },
}

module.exports = expensesView;