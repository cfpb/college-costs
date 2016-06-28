'use strict';

var getFinancial = require( '../dispatchers/get-financial-values' );
var publish = require( '../dispatchers/publish-update' );
var stringToNum = require( '../utils/handle-string-input' );
var formatUSD = require( 'format-usd' );
var numberToWords = require( 'number-to-words' );
var linksView = require( '../views/links-view' );
var metricView = require( '../views/metric-view' );
var postVerification = require( '../dispatchers/post-verify' );

require( '../libs/sticky-kit' );

var financialView = {
  $elements: $( '[data-financial]' ),
  $reviewAndEvaluate: $( '[data-section="review"], [data-section="evaluate"]' ),
  $verifyControls: $( '.verify_controls' ),
  $infoVerified: $( '.information-right' ),
  $infoIncorrect: $( '.information-wrong' ),
  $programLength: $( '#estimated-years-attending' ),
  $aboutThisTool: $( '.instructions_about a' ),
  $addPrivateButton: $( '.private-loans_add-btn' ),
  $gradPlusSection: $( '[data-section="gradPlus"]' ),
  $perkinsSection: $( '[data-section="perkins"]' ),
  $privateContainer: $( '.private-loans' ),
  $privateLoanClone: $( '[data-private-loan]:first' ).clone(),
  privateLoanKeys: [ 'amount', 'fees', 'rate', 'deferPeriod' ],
  $evaluateSection: $( '.evaluate' ),
  $bigQuestion: $( '.question' ),
  keyupDelay: null,
  currentInput: null,

  /**
   * Initiates the object
   */
  init: function() {
    this.keyupListener();
    this.focusoutListener();
    this.verificationListener();
    this.estimatedYearsListener();
    this.addPrivateListener();
    this.removePrivateListener();
    this.resetPrivateLoanView();
    this.continueStep2Listener();
  },

  /**
   * Sets all the values for caps in the errors notifications
   * @param {object} financials - the financials model
   */
  setCaps: function( financials ) {
    var capMap = {
          pell: 'pellCap',
          pellGrad: 'pellCap',
          perkins: 'perkinsUnderCap',
          perkinsGrad: 'perkinsGradCap',
          militaryTuitionAssistance: 'militaryAssistanceCap',
          militaryTuitionGrad: 'militaryAssistanceCap',
          directSubsidized: 'subsidizedCapYearOne',
          directSubsidizedGrad: 'subsidizedCapYearOne',
          directUnsubsidized: 'directUnsubsidizedIndepMax',
          directUnsubsidizedGrad: 'directUnsubsidizedIndepMax'
        },
        $elems = $( '[data-cap]' );

    $elems.each( function() {
      var $cap = $( this ),
          prop = $cap.attr( 'data-cap' ),
          capKey = capMap[prop],
          text;
      if ( financials.undergrad === false ) {
        capKey += 'Grad';
      }
      text = formatUSD( { amount: financials[capKey], decimalPlaces: 0 } );
      $cap.text( text );
    } );
  },

  /**
   * A better rounding function
   * @param {number} n - Number to be rounded
   * @param {number} decimals - Number of decimal places
   * @returns {number} rounded value
   */
  round: function( n, decimals ) {
    var number = n + 'e' + decimals;
    return Number( Math.round( number ) + 'e-' + decimals );
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
    this.updateRemainingCostContent();
    metricView.updateDebtBurden( values );
    metricView.updateMonthlyPayment();
    this.updateCalculationErrors( values );
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
   * Helper function that updates all percent elements in the financial view
   * @param {object} values - financial model values
   * @param {object} $percents - jQuery object of the percentage elements
   */
  updatePercentages: function( values, $percents ) {
    $percents.not( '#' + financialView.currentInput ).each( function() {
      var $ele = $( this ),
          name = $ele.attr( 'data-financial' ),
          value = financialView.round( values[name] * 100, 3 );
      financialView.updateElement( $ele, value, false );
    } );
  },

  /**
   * Helper function that updates all non-percent, non-privateLoan elements
   * in the financial view
   * @param {object} values - financial model values
   * @param {object} $leftovers - jQuery object of the "leftover" elements
   */
  updateLeftovers: function( values, $leftovers ) {
    $leftovers.not( '#' + financialView.currentInput ).each( function() {
      var $ele = $( this ),
          currency = true,
          name = $ele.attr( 'data-financial' );
      if ( financialView.currentInput === $( this ).attr( 'id' ) ) {
        currency = false;
      }
      if ( $ele.attr( 'data-currency' ) === 'false' ) {
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
      var $loanElements = $( this ),
          index = $loanElements.index(),
          $fields = $loanElements.find( '[data-private-loan_key]' );
      $fields.not( '#' + financialView.currentInput ).each( function() {
        var $ele = $( this ),
            key = $ele.attr( 'data-private-loan_key' ),
            val = values.privateLoanMulti[index][key],
            id = $ele.attr( 'id' ),
            isntCurrentInput = id !== financialView.currentInput;
        if ( $ele.is( '[data-percentage_value="true"]' ) ) {
          val *= 100;
          $ele.val( financialView.round( val, 3 ) );
        } else if ( isntCurrentInput && key === 'amount' ) {
          $ele.val( formatUSD( { amount: val, decimalPlaces: 0 } ) );
        } else {
          $ele.val( val );
        }
      } );
    } );
  },

  /**
   * Helper function that updates the conditional content in the financial view
   * that is based on the remaining cost
   */
  updateRemainingCostContent: function() {
    var finalRemainingCost = $( '#summary_remaining-cost-final' ),
        positiveRemainingCost = $( '.offer-part_content-positive-cost' ),
        negativeRemainingCost = $( '.offer-part_content-negative-cost' );
    positiveRemainingCost.hide();
    negativeRemainingCost.hide();
    if ( stringToNum( finalRemainingCost.text() ) > 0 ) {
      positiveRemainingCost.show();
    } else if ( stringToNum( finalRemainingCost.text() ) < 0 ) {
      negativeRemainingCost.show();
    }
  },

  /**
   * Updates view based on program data (including school data).
   * This updates the programLength dropdown and visibility of gradPLUS loans.
   * @param {object} values - An object with program values
   */
  updateViewWithProgram: function( values ) {
    // Update program length
    this.$programLength.val( values.programLength ).change();
    // Update links
    linksView.updateLinks( values );
    // Update availability of gradPLUS loans
    this.gradPlusVisible( values.level.indexOf( 'Graduate' ) !== -1 );
    this.perkinsVisible( values.offersPerkins );
  },

  /**
   * Update the view with calculation errors
   * @param {object} values - financial model values object
   */
  updateCalculationErrors: function( values ) {
    var errors = values.errors;

    // hide errors
    $( '[data-calc-error]' ).hide();

    this.checkOverCapErrors( errors );
    this.checkOverBorrowingErrors( errors );
  },

  /**
   * Checks and shows OverCap errors
   * @param {object} errors - Errors object
   */
  checkOverCapErrors: function( errors ) {
    var errorMap = {
      subsidizedOverCap: 'directSubsidized',
      unsubsidizedOverCap: 'directUnsubsidized',
      perkinsOverCap: 'perkins',
      pellOverCap: 'pellOverCap',
      mtaOverCap: 'militaryTuitionAssistance'
    };

    // check errors for overCap errors
    for ( var error in errors ) {
      if ( errors.hasOwnProperty( error ) ) {
        var key = errorMap[error],
            selector = '[data-calc-error="' + key + '"]';
        $( selector ).show();
      }
    }
  },

  /**
   * Checks and shows over-borrowing errors
   * @param {object} errors - Errors object
   */
  checkOverBorrowingErrors: function( errors ) {
    var overBorrowingErrors = [
          'perkinsOverCost', 'subsidizedOverCost',
          'unsubsidizedOverCost'
        ],
        showOverBorrowing = false,
        $over = $( '[data-calc-error="overBorrowing"]' );

    // check for over-borrowing
    for ( var i = 0; i < overBorrowingErrors.length; i++ ) {
      if ( errors.hasOwnProperty( overBorrowingErrors[i] ) ) {
        showOverBorrowing = true;
      }
    }
    if ( showOverBorrowing ) {
      var $current = $( '#' + financialView.currentInput );
      $over.appendTo( $current.parent() ).show();
    }
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
      var values = getFinancial.values();
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
    $( '[data-private-loan]' ).each( function() {
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
  },

  /**
   * Listener function for keyup in financial model INPUT fields
   */
  keyupListener: function() {
    this.$reviewAndEvaluate.on( 'keyup', '[data-financial]', function() {
      clearTimeout( financialView.keyupDelay );
      financialView.currentInput = $( this ).attr( 'id' );
      financialView.keyupDelay = setTimeout( function() {
        financialView.inputHandler( financialView.currentInput );
        financialView.updateView( getFinancial.values() );
      }, 500 );
    } );
  },

  /**
   * Listener function for focus out in financial model INPUT fields
   */
  focusoutListener: function() {
    this.$reviewAndEvaluate.on( 'focusout', '[data-financial]', function() {
      clearTimeout( financialView.keyupDelay );
      financialView.currentInput = $( this ).attr( 'id' );
      financialView.inputHandler( financialView.currentInput );
      financialView.currentInput = 'none';
      financialView.updateView( getFinancial.values() );
    } );
  },

  /**
   * Listener function for offer verification buttons
   */
  verificationListener: function() {
    this.$verifyControls.on( 'click', '.btn', function( e ) {
      var values = getFinancial.values();
      // Graph points need to be visible before updating their positions
      // to get all the right CSS values, so we'll wait 100 ms
      if ( $( this ).attr( 'href' ) === '#info-right' ) {
        e.preventDefault();
        financialView.$infoVerified.show();
        $( 'html, body' ).stop().animate( {
          scrollTop: financialView.$infoVerified.offset().top - 120
        }, 900, 'swing', function() {
          metricView.updateGraphs( values );
          window.location.hash = '#info-right';
          financialView.$aboutThisTool.focus();
          financialView.stickySummariesListener();
        } );
      } else {
        e.preventDefault();
        financialView.$infoIncorrect.show();
        postVerification.verify( values.offerID, values.schoolID, true );
        $( 'html, body' ).stop().animate( {
          scrollTop: financialView.$infoIncorrect.offset().top - 120
        }, 900, 'swing', function() {
          window.location.hash = '#info-wrong';
          financialView.$programLength.focus();
        } );
      }
      financialView.$verifyControls.hide();
    } );
  },

  /**
   * Listener function for "estimated years in program" select element
   */
  estimatedYearsListener: function() {
    this.$programLength.on( 'change', function() {
      var programLength = Number( $( this ).val() ),
          values = getFinancial.values(),
          yearsAttending = numberToWords.toWords( programLength );
      if ( programLength % 1 !== 0 ) {
        yearsAttending += ' and a half';
      }
      publish.financialData( 'programLength', programLength );
      publish.financialData( 'yearsAttending', yearsAttending );
      financialView.updateView( values );
    } );
  },

  gradPlusVisible: function( visibility ) {
    if ( visibility === false ) {
      this.$gradPlusSection.hide();
      publish.financialData( 'gradPlus', 0 );
    } else {
      this.$gradPlusSection.show();
    }
  },

  perkinsVisible: function( visibility ) {
    if ( visibility === false ) {
      this.$perkinsSection.hide();
    } else {
      this.$perkinsSection.show();
    }
  },

  continueStep2Listener: function() {
    var $continueButton = $( '.continue_controls > .btn' );
    $continueButton.on( 'click', function() {
      // Remove continue button
      $continueButton.hide();
      // Show Step 2
      financialView.$evaluateSection.show();
      financialView.$bigQuestion.show();
      $( 'html, body' ).stop().animate( {
        scrollTop: financialView.$evaluateSection.offset().top - 120
      }, 900, 'swing', function() {} );
    } );
  },

  /**
   * Stick the sidebar aid offer summaries to the viewport top
   * if the summaries are in the inline-block sidebar column
   */
  stickySummariesListener: function() {
    var $stickyOffers = $( '.offer-part_summary-wrapper' );
    $stickyOffers.stick_in_parent()
      .on( 'sticky_kit:bottom', function( e ) {
        $( e.target ).addClass( 'is_bottomed' );
      } )
      .on( 'sticky_kit:unbottom', function( e ) {
        $( e.target ).removeClass( 'is_bottomed' );
      } );
  }
};

module.exports = financialView;
