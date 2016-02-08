'use strict';

var getModelValues = require( '../dispatchers/get-model-values' );
var getSchoolValues = require( '../dispatchers/get-school-values' );
var publish = require( '../dispatchers/publish-update' );
var stringToNum = require( '../utils/handle-string-input' );
var formatUSD = require( 'format-usd' );

var financialView = {
  $elements: $( '[data-financial]' ),
  $review: $( '[data-section="review"]' ),
  $programLength: $( '#estimated-years-attending' ),
  $addPrivateButton: $( '.private-loans_add-btn' ),
  $privateContainer: $( '.private-loans' ),
  $privateLoanClone: $( '[data-private-loan]:first' ).clone(),
  privateLoanKeys: [ 'baseAmount', 'fees', 'rate', 'deferPeriod' ],
  keyupDelay: null,
  currentInput: null,

  init: function() {
    var values = getModelValues.financial();
    this.keyupListener();
    this.estimatedYearsListener();
    this.$programLength.val( getSchoolValues.getProgramLength() );
    this.addPrivateListener();
    this.removePrivateListener();
    this.resetPrivateLoanView();
    this.updateView( values );
  },

  updateElement: function ( $ele, value, currency ) {
    if ( $ele.prop( 'tagName' ) === 'INPUT' ) {
      if ( currency === true ) {
        value = formatUSD( value, { decimalPlaces: 0 } );
      }
      $ele.val( value );
    } else {
      $ele.text( value );
    }
  },

  updateView: function( values ) {
    // handle non-private-loan fields
    var $nonPrivate = this.$elements.not( '[data-private-loan_key]' ),
        $percents = $nonPrivate.filter( '[data-percentage_value]' ),
        $leftovers = $nonPrivate.not( '[data-percentage_value]' ),
        $privateLoans = $( '[data-private-loan]' );
    $percents.each( function() {
      var $ele = $( this ),
          name = $ele.attr( 'data-financial' ),
          value = values[name] * 100;
      financialView.updateElement( $ele, value, false );
    } );
    $leftovers.each( function() {
      var $ele = $( this ),
          currency = true,
          name = $ele.attr( 'data-financial' );
      if ( financialView.currentInput === $( this ).attr( 'id' ) ) {
        currency = false;
      }
      financialView.updateElement( $ele, values[name], currency );
    } );
    $privateLoans.each( function() {
      var index = $( this ).index(),
          $fields = $( this ).find( '[data-private-loan_key]' );
      $fields.each( function() {
        var key = $( this ).attr( 'data-private-loan_key' ),
            val = values.privateLoanMulti[index][key],
            isntCurrentInput = ( $( this ).attr( 'id' ) !== financialView.currentInput );
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
    console.log( values );
  },

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

  resetPrivateLoanView: function() {
    // remove the 2 excess private loans (3 exist initially as a NoJS fallback)
    $( '[data-private-loan]' ).each( function() {
      var index = $( this ).index();
      if ( index > 0 ) {
        $( this ).remove();
        publish.dropPrivateLoan( index );
      }
    } );
  },

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

  keyupListener: function() {
    this.$review.on( 'keyup', '[data-financial]', function() {
      clearTimeout( financialView.keyupDelay );
      financialView.currentInput = $( this ).attr( 'id' );
      financialView.keyupDelay = setTimeout( function() {
        financialView.inputHandler( financialView.currentInput );
      }, 500 );
    } );
  },

  estimatedYearsListener: function() {
    this.$programLength.on( 'change', function() {
      var programLength = $( this ).val(),
          values = getModelValues.financial();
      publish.financialData( 'programLength', programLength );
      financialView.updateView( values );
    });
  }

};

module.exports = financialView;
