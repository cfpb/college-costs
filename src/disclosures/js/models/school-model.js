'use strict';

var getSchoolValues = require( '../dispatchers/get-school-values' );


var schoolModel = {
  values: {},

  init: function( apiData ) {
    this.values = apiData;
    this.values = getSchoolValues.getBLSExpenses( this.values );
    return this.processAPIData( this.values );
  },

  /**
   * Fixes certain API values for use in this app
   * @param {object} values - object containing unformatted API values
   * @returns {object} object with reformatted values
   */
  processAPIData: function( values ) {
    values.jobRate = values.jobRate || '';
    values.programLength /= 12;
    values.defaultRate /= 100;
    values.medianSalary = values.salary || values.medianAnnualPay;
    values.monthlySalary = Math.round( Number( values.medianSalary ) / 12 ).toFixed( 0 );
    values.medianSchoolDebt = values.medianStudentLoanCompleters || values.medianTotalDebt;
    if ( values.hasOwnProperty( 'completionRate') && values.completionRate !== 'None' ) {
      values.gradRate = values.completionRate;
    }

    return values;
  }

};
module.exports = schoolModel;
