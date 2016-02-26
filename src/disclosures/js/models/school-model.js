'use strict';


var schoolModel = {
  values: {},

  init: function( apiData ) {
    this.values = apiData;
    this.values = this.processBLSExpenses( this.values );
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
    values.medianSalary = values.salary || values.medianAnnualPay;
    values.monthlySalary = Math.round( Number( values.medianSalary ) / 12 );
    values.medianSchoolDebt = values.medianStudentLoanCompleters || values.medianTotalDebt;
    if ( values.hasOwnProperty( 'completionRate') && values.completionRate !== 'None' ) {
      values.gradRate = values.completionRate;
    }

    return values;
  },

  processBLSExpenses: function( values ) {
    // BLS expense data is delivered as annual values.
    // The tool displays monthly expenses.

    if ( values.region === 'Not available' ) {
      values.BLSAverage = 'national';
      values.monthlyRent = Math.round( values.nationalHousing / 12 );
      values.monthlyFood = Math.round( values.nationalFood / 12 );
      values.monthlyTransportation =
        Math.round( values.nationalTransportation / 12 );
      values.monthlyInsurance = Math.round( values.nationalHealthcare / 12 );
      values.monthlySavings = Math.round( values.nationalRetirement / 12 );
      values.monthlyOther =
        Math.round( values.nationalEntertainment / 12 );
    } else {
      values.BLSAverage = values.region + ' regional';
      values.monthlyRent = Math.round( values.regionalHousing / 12 );
      values.monthlyFood = Math.round( values.regionalFood / 12 );
      values.monthlyTransportation =
        Math.round( values.regionalTransportation / 12 );
      values.monthlyInsurance = Math.round( values.regionalHealthcare / 12 );
      values.monthlySavings = Math.round( values.regionalRetirement / 12 );
      values.monthlyOther =
        Math.round( values.regionalEntertainment / 12 );
    }
    return values;
  }


};
module.exports = schoolModel;
