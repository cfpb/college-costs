'use strict';

var getExpenses = require( '../dispatchers/get-expenses-values' );
var publish = require( '../dispatchers/publish-update' );
var formatUSD = require( 'format-usd' );
var stringToNum = require( '../utils/handle-string-input' );

var expensesView = {
  $elements: $( '[data-expenses]' ),
  $reviewAndEvaluate: $( '[data-section="review"], [data-section="evaluate"]' ),
  currentInput: '',

  init: function() {
    this.keyupListener();
    this.regionSelectListener();
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
   * Helper function for handling user entries in expenses model INPUT fields
   * @param {string} id - The id attribute of the element to be handled
   */
  inputHandler: function( id ) {
    var $ele = $( '#' + id ),
        value = stringToNum( $ele.val() ),
        key = $ele.attr( 'data-expenses' );
    publish.expensesData( key, value );
  },

  /**
   * Listener function for keyup in expenses INPUT fields
   */
  keyupListener: function() {
    this.$reviewAndEvaluate.on( 'keyup', '[data-expenses]', function() {
      clearTimeout( expensesView.keyupDelay );
      expensesView.currentInput = $( this ).attr( 'id' );
      expensesView.keyupDelay = setTimeout( function() {
        expensesView.inputHandler( expensesView.currentInput );
        expensesView.updateView( getExpenses.values() );
      }, 500 );
    } );
  },

  /**
   * Listener for the BLS region SELECT
   */
  regionSelectListener: function() {
    $( '#bls-region-select' ).change( function() {
      var region = $( this ).val();
      publish.updateRegion( region );
      expensesView.updateView( getExpenses.values() );
    } );
  }


};

module.exports = expensesView;
