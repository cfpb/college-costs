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

  sumScholarships: function() {
    var model = financialModel.values;
    // model.scholarships as a sum of UI inputs
    model.scholarships =
      model.schoolGrants +
      model.stateGrants +
      model.otherScholarships;
  },

  calc: function() {
    this.sumScholarships();
    this.values = recalculate( this.values );
    this.sumTotals();
  },

  sumTotals: function() {
    var model = financialModel.values;

    // Cost after grants

    model.costAfterGrants = model.costOfAttendance - model.grantsTotal;

    // monthly expenses
    model.totalMonthlyExpenses =
      model.monthlyRent + model.monthlyFood +
      model.monthlyTransportation + model.monthlyInsurance +
      model.monthlySavings + model.monthlyOther;
  }
};
module.exports = financialModel;
