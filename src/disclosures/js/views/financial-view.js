'use strict';

var getModelValues = require( '../dispatchers/get-model-values' );
var getSchoolValues = require( '../dispatchers/get-school-values' );
var getViewValues = require( '../dispatchers/get-view-values' );
var publish = require( '../dispatchers/publish-update' );
var stringToNum = require( '../utils/handle-string-input' );
var formatUSD = require( 'format-usd' );
var numberToWords = require( 'number-to-words' );
var linksView = require( '../views/links-view' );

var financialView = {
  $elements: $( '[data-financial]' ),
  $review: $( '[data-section="review"]' ),
  $programLength: $( '#estimated-years-attending' ),
  $addPrivateButton: $( '.private-loans_add-btn' ),
  $privateContainer: $( '.private-loans' ),
  $privateLoanClone: $( '[data-private-loan]:first' ).clone(),
  privateLoanKeys: [ 'amount', 'fees', 'rate', 'deferPeriod' ],
  keyupDelay: null,
  currentInput: null,

  /**
   * Initiates the object
   */
  init: function() {
    var values = getModelValues.financial();
    this.keyupListener();
    this.focusoutListener();
    this.estimatedYearsListener();
    this.addPrivateListener();
    this.removePrivateListener();
    this.resetPrivateLoanView();
    this.updateView( values );
  },

  /**
   * Helper function that updates the value or text of an element
   * @param {object} $ele - jQuery object of the element to update
   * @param {number|string} value - The new value
   * @param {Boolean} currency - True if the value is to be formatted as currency
   */
  updateElement: function( $ele, value, currency ) {
    if ( $ele.prop( 'tagName' ) === 'INPUT' ) {
      if ( currency === true ) {
        value = formatUSD( value, { decimalPlaces: 0 } );
      }
      $ele.val( value );
    } else {
      $ele.text( value );
    }
  },

  /**
   * Helper function that updates all percent elements in the financial view
   * @param {object} values - financial model values
   * @param {object} $percents - jQuery object of the percentage elements
   */
  updatePercentages: function( values, $percents ) {
    $percents.each( function() {
      var $ele = $( this ),
          name = $ele.attr( 'data-financial' ),
          value = values[name] * 100;
      financialView.updateElement( $ele, value, false );
    } );
  },

  /**
   * Helper function that updates all non-percent, non-privateLoan elements in the financial view
   * @param {object} values - financial model values
   * @param {object} $leftovers - jQuery object of the "leftover" elements
   */
  updateLeftovers: function( values, $leftovers ) {
    $leftovers.each( function() {
      var $ele = $( this ),
          currency = true,
          name = $ele.attr( 'data-financial' );
      if ( financialView.currentInput === $( this ).attr( 'id' ) ) {
        currency = false;
      }
      financialView.updateElement( $ele, values[name], currency );
    } );
  },

  /**
   * Helper function that updates all private loan values in the financial view
   * @param {object} values - financial model values
   * @param {object} $privateLoans - jQuery object of the private loan elements
   */
  updatePrivateLoans: function( values, $privateLoans ) {
    $privateLoans.each( function() {
      var index = $( this ).index(),
          $fields = $( this ).find( '[data-private-loan_key]' );
      $fields.each( function() {
        var key = $( this ).attr( 'data-private-loan_key' ),
            val = values.privateLoanMulti[index][key],
            isntCurrentInput = $( this ).attr( 'id' ) !== financialView.currentInput;
        if ( $( this ).is( '[data-percentage_value="true"]' ) ) {
          val *= 100;
          $( this ).val( val );
        } else if ( isntCurrentInput && key === 'baseAmount' ) {
          $( this ).val( formatUSD( val, { decimalPlaces: 0 } ) );
        } else {
          $( this ).val( val );
        }
      } );
    } );
  },

  /**
   * Function that updates the view with new values
   * @param {object} values - financial model values
   */
  updateView: function( values ) {
    // handle non-private-loan fields
    var $nonPrivate = this.$elements.not( '[data-private-loan_key]' ),
        $percents = $nonPrivate.filter( '[data-percentage_value]' ),
        $leftovers = $nonPrivate.not( '[data-percentage_value]' ),
        $privateLoans = $( '[data-private-loan]' );
    this.updatePercentages( values, $percents );
    this.updateLeftovers( values, $leftovers );
    this.updatePrivateLoans( values, $privateLoans );
  },

  /**
   * Updates view based on program data (including school data). This updates the
   * programLength dropdown and visibility of gradPLUS loans.
   */
  updateViewFromProgram: function( values ) {
    // Update program length
    this.$programLength.val( values.programLength ).change();
    // Update links
    linksView.updateLinks( values );
    // Update availability of gradPLUS loans
  },

  /**
   * Listener function for the "add private loan" button
   */
  addPrivateListener: function() {
    this.$addPrivateButton.click( function() {
      var $container = $( '.private-loans' ),
          $button = $( '[data-add-loan-button]' );
      financialView.$privateLoanClone.clone().insertBefore( $button );
      financialView.enumeratePrivateLoanIDs();
      $container.find( '[data-private-loan]:last .aid-form_input' ).val( '0' );
      publish.addPrivateLoan();
    } );
  },

  /**
   * Listener function for the "remove private loan" button
   */
  removePrivateListener: function() {
    var buttonClass = '.private-loans_remove-btn';
    this.$privateContainer.on( 'click', buttonClass, function() {
      var $ele = $( this ).closest( '[data-private-loan]' ),
          index = $ele.index();
      $ele.remove();
      financialView.enumeratePrivateLoanIDs();
      publish.dropPrivateLoan( index );
      var values = getModelValues.financial();
      financialView.updateView( values );
    } );
  },

  /**
   * Function which removes two of the three initial private loan elements
   * (Three exist on load for no-js scenario)
   */
  resetPrivateLoanView: function() {
    $( '[data-private-loan]' ).each( function() {
      var index = $( this ).index();
      if ( index > 0 ) {
        $( this ).remove();
        publish.dropPrivateLoan( index );
      }
    } );
  },

  /**
   * Helper function that renumbers the IDs of private loan elements
   */
  enumeratePrivateLoanIDs: function() {
    // renumber private loan ids to prevent duplicate IDs
    $( '[data-private-loan' ).each( function() {
      var index = $( this ).index(),
          $ele = $( this ),
          $fields = $ele.find( '[data-private-loan_key]' );
      $fields.each( function() {
        var name = $( this ).attr( 'name' ),
            newID = name + '_' + index.toString();
        $( this ).attr( 'id', newID );
      } );
    } );
  },

  /**
   * Helper function for handling user entries in financial model INPUT fields
   * @param {string} id - The id attribute of the element to be handled
   */
  inputHandler: function( id ) {
    var $ele = $( '#' + id ),
        value = stringToNum( $ele.val() ),
        key = $ele.attr( 'data-financial' ),
        privateLoanKey = $ele.attr( 'data-private-loan_key' ),
        percentage = $ele.attr( 'data-percentage_value' );
    if ( percentage === 'true' ) {
      value /= 100;
    }
    if ( typeof privateLoanKey !== 'undefined' ) {
      var index = $ele.closest( '[data-private-loan]' ).index(),
          privLoanKey = $ele.attr( 'data-private-loan_key' );
      publish.updatePrivateLoan( index, privLoanKey, value );
    } else {
      publish.financialData( key, value );
    }
    var values = getModelValues.financial();
    financialView.updateView( values );
  },

  /**
   * Listener function for keyup in financial model INPUT fields
   */
  keyupListener: function() {
    this.$review.on( 'keyup', '[data-financial]', function() {
      clearTimeout( financialView.keyupDelay );
      financialView.currentInput = $( this ).attr( 'id' );
      financialView.keyupDelay = setTimeout( function() {
        financialView.inputHandler( financialView.currentInput );
      }, 500 );
    } );
  },

  /**
   * Listener function for focus out in financial model INPUT fields
   */
  focusoutListener: function() {
    this.$review.on( 'focusout', '[data-financial]', function() {
      clearTimeout( financialView.keyupDelay );
      financialView.currentInput = $( this ).attr( 'id' );
      financialView.inputHandler( financialView.currentInput );
    } );
  },

  /**
   * Listener function for "estimated years in program" select element
   */
  estimatedYearsListener: function() {
    this.$programLength.on( 'change', function() {
      var programLength = Number( $( this ).val() ),
          values = getModelValues.financial(),
          yearsAttending = numberToWords.toWords( programLength );
      publish.financialData( 'programLength', programLength );
      publish.financialData( 'yearsAttending', yearsAttending );
      financialView.updateView( values );
    } );
  }
};

module.exports = financialView;
