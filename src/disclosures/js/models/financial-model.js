'use strict';

var recalculate = require( 'student-debt-calc' );
var getViewValues = require( '../dispatchers/get-view-values' );

var financialModel = {
  values: {},

  init: function() {
    var val = getViewValues.inputs();
    this.calc ( val );
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
    model.costOfAttendance - model.totalGrantsScholarships

  // total contributions
  model.totalContributions =
    model.savings + model.family + model.workstudy;
  }
};
module.exports = financialModel;
