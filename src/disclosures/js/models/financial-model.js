'use strict';

var recalculate = require( 'student-debt-calc' );
var getViewValues = require( '../dispatchers/get-view-values' );

var financialModel = {
  values: {},

  /**
   * Initiates the model
   * @param {object} apiData - Data received from the schoolData API
   */
  init: function( apiData ) {
    this.values = getViewValues.init( apiData );
    // we don't use directPlus in the UI
    this.values.directPlus = 0;
    this.calc();
  },

  /**
   * Adds various scholarships to form the 'scholarships' property
   */
  sumScholarships: function() {
    var model = financialModel.values;
    // model.scholarships as a sum of UI inputs
    model.scholarships =
      model.schoolGrants +
      model.stateGrants +
      model.otherScholarships;
  },

  /**
   * Performs calculations using student-debt-calc package
   */
  calc: function() {
    this.sumScholarships();
    this.values = recalculate( this.values );
    this.sumTotals();
    this.roundValues();
  },

  /**
   * Sums totals for various view elements
   */
  sumTotals: function() {
    var model = financialModel.values;

    model.costAfterGrants = model.costOfAttendance - model.grantsTotal;
    model.totalProgramDebt = model.borrowingTotal * model.programLength;

    // monthly expenses
    model.totalMonthlyExpenses =
      Math.round( model.monthlyRent + model.monthlyFood +
      model.monthlyTransportation + model.monthlyInsurance +
      model.monthlySavings + model.monthlyOther ).toFixed( 0 );

    model.monthlyLeftover = Math.round( model.monthlySalary -
      model.totalMonthlyExpenses - model.monthlyLoanPayment ).toFixed( 0 );
  },

  /**
   * Rounds values for which we do not want to display decimals
   */
  roundValues: function() {
    var model = financialModel.values;
    model.totalDebt = Math.round( model.totalDebt );
  }
};
module.exports = financialModel;
