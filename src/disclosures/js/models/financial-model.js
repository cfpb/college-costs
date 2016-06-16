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
   * Checks if the school offers Perkins loans, zeros value if not
   */
  checkPerkins: function() {
    if ( this.values.offersPerkins === false ) {
      this.values.perkins = 0;
    }
  },

  /**
   * Adds various academic costs to form the 'directCost' property
   */
  sumDirectCost: function() {
    var model = financialModel.values;
    // model.directCost as a sum of URL inputs
    model.directCost =
      ( model.tuitionFees + model.books ) * model.programLength;
  },

  /**
   * Sums the total family contributions
   */
  sumFamilyTotal: function() {
    var model = financialModel.values;
    // familyTotal is family contributions + parent PLUS loan
    model.familyTotal = model.family + model.parentPlus;

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
    this.checkPerkins();
    this.values = recalculate( this.values );
    this.sumTotals();
    this.roundValues();
    this.reportErrors();
    this.sumDirectCost();
    console.log( this.values );
  },

  /**
   * Sums totals for various view elements
   */
  sumTotals: function() {
    var model = financialModel.values;

    model.costAfterGrants = model.costOfAttendance - model.grantsTotal;
    model.totalProgramDebt = model.borrowingTotal * model.programLength;
  },

  /**
   * Rounds values for which we do not want to display decimals
   */
  roundValues: function() {
    var model = financialModel.values,
        roundedKeys = [ 'totalDebt', 'loanMonthly', 'loanLifetime' ];
    for ( var x = 0; x < roundedKeys.length; x++ ) {
      var key = roundedKeys[x];
      model[key] = Math.round( model[key] );
    }
  },

  /**
   * Updates the financial model with values from school and program data
   * @param { object } schoolValues - contains school and program data values
   */
  updateModelWithProgram: function( schoolValues ) {
    schoolValues.undergrad = true;
    if ( schoolValues.level.indexOf( 'Graduate' ) !== -1 ) {
      schoolValues.undergrad = false;
    }
    $.extend( this.values, schoolValues );
  },

  /**
   * Report errors to the user
   */
  reportErrors: function() {
    // This is something of a placeholder for future code.
    // For now, feel free to uncomment the following and view the errors object.
    // console.log( this.values.errors );
  }

};
module.exports = financialModel;
