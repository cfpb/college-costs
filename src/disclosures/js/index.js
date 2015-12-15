'use strict';

var financialModel = require( './models/financial-model' );
var financialView = require( './views/financial-view' );

require('./utils/nemo');
require('./utils/nemo-shim');

var app = {
  init: function() {
    financialModel.init();
    financialView.init();
  }
};


$( document ).ready( function() {
  app.init();

  // Demo code—remove this when the app is more fully functional!

  // $( '#calculate-debt' ).click( function() {
  //   updateModelFromView();
  //   updateViewFromModel();
  // });
  //
  // $( '#add-random' ).click( function() {
  //   randomFinancials();
  // });
  //
  // $( '#costs__tuition' ).val( '10,000' );
  // $( '#costs__room-and-board' ).val( '5,000' );
  // $( '#costs__books' ).val( '500' );
  // $( '#costs__transportation' ).val( '500' );
  // $( '#costs__other' ).val( '0' );
  // $( '[data-financial="costOfAttendance"]' ).text( '16,000' );
  // $( '#grants__pell' ).val( '1,000' );
  // $( '#grants__scholarships' ).val( '3,000' );
  // $( '[data-financial="totalGrantsScholarships"]' ).text( '4,000' );
  // $( '[data-financial="totalCost"]' ).text( '12,000' );
  // $( '#contrib__savings' ).val( '1,000' );
  // $( '#contrib__family' ).val( '0' );
  // $( '#contrib__workstudy' ).val( '0' );
  // $( '[data-financial="totalCashYou"]' ).text( '1,000' );
  // $( '[data-financial="totalCashFamily"]' ).text( '0' );
  // $( '[data-financial="totalWorkstudy"]' ).text( '0' );
  // $( '[data-financial="totalContributions"]' ).text( '1,000' );
  // $( '#contrib__perkins' ).val( '3,000' );
  // $( '#contrib__subsidized' ).val( '3,000' );
  // $( '#contrib__unsubsidized' ).val( '2,000' );
  // $( '#contrib__direct-plus' ).val( '0' );
  // $( '[data-financial="totalFederalLoans"]' ).text( '8,000' );
  // $( '[data-financial="privateLoan"]' ).val( '0' );
  // $( '[data-financial="privateLoanInterest"]' ).val( '7.9' );
  // $( '[data-financial="privateLoanFees"]' ).val( '4.9' );
  // $( '[data-financial="privateLoanGracePeriod"]' ).val( '6' );
  // $( '[data-financial="privateLoanTerm10"]' ).attr( 'checked', true );
  // $( '#contrib__payment-plan' ).val( '2,000' );
  // $( '[data-financial="totalPrivateLoans"]' ).text( '2,000' );
  // $( '[data-financial="totalDebt"]' ).text( '10,000' );
  // $( '[data-financial="remainingCost"]' ).text( '1,000' );
  // $( '[data-financial="totalProgramDebt"]' ).text( '20,000' );
  // $( '[data-financial="totalRepayment"]' ).text( '36,450' );
  // $( '.total-debt-after-graduation .bar-graph_point__you').css('top', '20px');
  // $( '.total-debt-after-graduation .bar-graph_point__average').css('top', '80px');
  // $( '.graduation-rate .bar-graph_point__you').css('top', '100px');
  // $( '.graduation-rate .bar-graph_point__average').css('top', '20px');
  // $( '.average-salary .bar-graph_point__you').css('top', '90px');
  // $( '.average-salary .bar-graph_point__average').css('top', '40px');
  // $( '.loan-default-rates .bar-graph_point__you').css('top', '25px');
  // $( '.loan-default-rates .bar-graph_point__average').css('top', '70px');
  // $( '[data-expense="monthlyRent"]' ).val( '800' );
  // $( '[data-expense="monthlyFood"]' ).val( '300' );
  // $( '[data-expense="monthlyTransportation"]' ).val( '200' );
  // $( '[data-expense="monthlyInsurance"]' ).val( '100' );
  // $( '[data-expense="monthlySavings"]' ).val( '50' );
  // $( '[data-expense="monthlyOther"]' ).val( '50' );
  // $( '[data-expense="totalMonthlyExpenses"]' ).text( '1,500' );
  // $( '[data-expense="monthlySalary"]' ).text( '2,166' );
  // $( '[data-expense="monthlyLoanPayment"]' ).text( '550' );
  // $( '[data-expense="monthlyLeftover"]' ).text( '116' );
  //
  // // End demo code
  //
  // if ( location.search !== '' ) {
  //   var urlValues = queryHandler( location.search );
  //   $.extend( financials.values, urlValues );
  //   financials.calc();
  //   schoolView.updateView( financials.values );
  // }


});
