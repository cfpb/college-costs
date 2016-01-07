'use strict';

var recalculate = require( 'student-debt-calc' );
var getViewValues = require( '../dispatchers/get-view-values' );
var fetch = require( '../dispatchers/get-api-values' );

var financialModel = {
  values: {},

  init: function() {
    // jquery promise to delay model creation until ajax resolves
    $.when( fetch.constants() ).done( function( resp ) {
      // get the values from the url and view & calculate
      var val = getViewValues.init( resp );
      financialModel.calc( val );
    } );
  },

  calc: function( val ) {
    this.values = recalculate( val );
    this.sumTotals();
  },

  sumTotals: function( ) {
    var model = financialModel.values;

    // total grants and scholarships
    model.totalGrantsScholarships =
      model.scholarships + model.pell;

    // total cost is attendance minus grants and scholarships
    model.totalCost =
      model.costOfAttendance - model.totalGrantsScholarships;

    // total contributions
    model.totalContributions =
      model.savings + model.family + model.workstudy;

    // total private loans
    // TODO accomodate for multiple private loans
    model.totalPrivateLoans =
      model.privateLoan + model.institutionalLoan;

    // loan totals
    model.loanTotal =
      model.federalTotal + model.totalPrivateLoans;

    // remaining cost
    model.remainingCost =
      model.totalCost - model.totalContributions - model.loanTotal;

    // monthly expenses
    model.totalMonthlyExpenses =
      model.monthlyRent + model.monthlyFood +
      model.monthlyTransportation + model.monthlyInsurance +
      model.monthlySavings + model.monthlyOther;
  }
};
module.exports = financialModel;
