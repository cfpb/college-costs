'use strict';

var recalculate = require( 'student-debt-calc' );
var getViewValues = require( '../dispatchers/get-view-values' );

var financialModel = {
  values: {},

  init: function( apiData ) {
    this.values = getViewValues.init( apiData );
    // we don't use directPlus in the UI
    this.values.directPlus = 0;
    this.calc();
  },

  calc: function() {
    this.values = recalculate( this.values );
    this.sumTotals();
  },

  sumTotals: function() {
    var model = financialModel.values;

    // total family contributions and loans
    // since these values aren't in the UI we optionally add them as 0
    model.family =
      ( model.parentLoan || 0 ) +
      ( model.parentplus || 0 );

    // total other scholarships and grants
    // since these values aren't in the UI we optionally add them as 0
    model.scholarships =
      ( model.otherScholarships || 0 ) +
      ( model.militaryAssistance || 0 ) +
      ( model.giBill || 0 );

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
