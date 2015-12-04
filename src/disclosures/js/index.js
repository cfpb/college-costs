'use strict';

var FinancialModel = require( './lib/financial-data.js' ),
    financials = new FinancialModel(),
    View = require( './lib/school-view.js' ),
    schoolView = new View(),
    queryHandler = require( './lib/query-handler.js' );

require('./nemo');
require('./nemo-shim');


function init() {
  // Set the financials.values property with defaults
  financials.calc();
}

function randomFinancials() {
  $( '[data-financial]' ).each( function() {
    var val = Math.floor( Math.random() * 10000 );

    $( this ).val( val );
  });
}

function updateModelFromView() {
  var newValues = schoolView.getValues();
  $.extend( financials.values, newValues );
  financials.calc();
}

function updateViewFromModel() {
  schoolView.updateView( financials.values );
}

$( document ).ready( function() {
  init();

  // Demo code—remove this when the app is more fully functional!

  $( '#calculate-debt' ).click( function() {
    updateModelFromView();
    updateViewFromModel();
  });

  $( '#add-random' ).click( function() {
    randomFinancials();
  });

  $( '#costs__tuition' ).val( '10,000' );
  $( '#costs__room-and-board' ).val( '5,000' );
  $( '#costs__books' ).val( '500' );
  $( '#costs__transportation' ).val( '500' );
  $( '#costs__other' ).val( '0' );
  $( '[data-financial="costOfAttendance"]' ).text( '16,000' );
  $( '#grants__pell' ).val( '1,000' );
  $( '#grants__scholarships' ).val( '3,000' );
  $( '[data-financial="totalGrantsScholarships"]' ).text( '4,000' );
  $( '[data-financial="totalCost"]' ).text( '12,000' );
  $( '#contrib__savings' ).val( '1,000' );
  $( '#contrib__state529plan' ).val( '0' );
  $( '#contrib__workstudy' ).val( '0' );
  $( '[data-financial="totalCash"]' ).text( '1,000' );
  $( '[data-financial="totalParentLoans"]' ).text( '0' );
  $( '[data-financial="totalWorkstudy"]' ).text( '0' );
  $( '[data-financial="totalContributions"]' ).text( '1,000' );
  $( '#contrib__perkins' ).val( '3,000' );
  $( '#contrib__subsidized' ).val( '3,000' );
  $( '#contrib__unsubsidized' ).val( '2,000' );
  $( '[data-financial="totalFederalLoans"]' ).text( '8,000' );
  $( '[data-financial="privateLoan"]' ).val( '0' );
  $( '[data-financial="privateLoanInterest"]' ).val( '7.9' );
  $( '[data-financial="privateLoanGracePeriod"]' ).val( '6' );
  $( '[data-financial="privateLoanTerm"]' ).val( '10' );
  $( '#contrib__payment-plan' ).val( '2,000' );
  $( '[data-financial="totalPrivateLoans"]' ).text( '2,000' );
  $( '[data-financial="totalDebt"]' ).text( '10,000' );
  $( '[data-financial="remainingCost"]' ).text( '1,000' );
  $( '[data-financial="totalProgramDebt"]' ).text( '20,000' );
  $( '[data-financial="totalRepayment"]' ).text( '36,450' );
  $( '.total-debt-after-graduation .bar-graph_point__you').css('top', '20px');
  $( '.total-debt-after-graduation .bar-graph_point__average').css('top', '60px');

  // End demo code

  if ( location.search !== '' ) {
    var urlValues = queryHandler( location.search );
    $.extend( financials.values, urlValues );
    financials.calc();
    schoolView.updateView( financials.values );
  }


});
