'use strict';

var numberToWords = require( 'number-to-words' );

var getSchoolValues = {

  init: function( ) {
    var values = {};

    values.programLength = this.getProgramLength();
    values.yearsAttending = numberToWords.toWords( values.programLength );
    values.gradRate = this.getGradRate();
    values.medianSchoolDebt = this.getMedianSchoolDebt();
    values.defaultRate = this.getDefaultRate();
    values.medianSalary = this.getMedianSalary();
    values.monthlySalary = this.setMonthlySalary( values.medianSalary );
    values = this.getBLSExpenses( values );
    values.jobRate = this.getJobRate();

    return values;
  },

  getProgramLength: function() {
    var programLength;

    if ( window.hasOwnProperty( 'programData' ) ) {
      // Rounds up to the nearest number of years.
      // Might need to change later, to address 18 month or 30 month programs.
      programLength = Math.ceil( window.programData.programLength / 12
        ) || null;
    } else {
      programLength = null;
    }

    return programLength;
  },

  getJobRate: function() {
    var jobRate;

    if ( window.hasOwnProperty( 'programData' ) ) {
      jobRate = Number( window.programData.jobRate ) || '';
    } else {
      jobRate = '';
    }

    return jobRate;
  },

  getGradRate: function() {
    var gradRate = '';

    if ( window.hasOwnProperty( 'schoolData' ) ) {
      gradRate = window.schoolData.gradRate || '';
    }

    return gradRate;
  },

  getCompletionRate: function() {
    var completionRate = '';

    if ( window.hasOwnProperty( 'programData' ) ) {
      if ( window.programData.completionRate === 'None' ) {
        completionRate = '';
      } else {
        completionRate = window.programData.completionRate || '';
      }
    }

    return completionRate;
  },

  getMedianSchoolDebt: function() {
    var medianSchoolDebt;

    if ( window.hasOwnProperty( 'programData' ) &&
      window.hasOwnProperty( 'schoolData' ) ) {
      medianSchoolDebt = window.programData.medianStudentLoanCompleters ||
        window.schoolData.medianTotalDebt;
    } else if ( window.hasOwnProperty( 'schoolData' ) ) {
      medianSchoolDebt = window.schoolData.medianTotalDebt;
    } else {
      medianSchoolDebt = '';
    }

    return medianSchoolDebt;
  },

  getDefaultRate: function() {
    var defaultRate;

    if ( window.hasOwnProperty( 'programData' ) &&
      window.hasOwnProperty( 'schoolData' ) ) {
      defaultRate = window.programData.defaultRate / 100 ||
        window.schoolData.defaultRate;
    } else if ( window.hasOwnProperty( 'schoolData' ) ) {
      defaultRate = window.schoolData.defaultRate;
    } else {
      defaultRate = '';
    }

    return defaultRate;
  },

  getMedianSalary: function() {
    var medianSalary;

    if ( window.hasOwnProperty( 'programData' ) &&
      window.hasOwnProperty( 'schoolData' ) ) {
      medianSalary = window.programData.salary ||
        window.schoolData.medianAnnualPay;
    } else if ( window.hasOwnProperty( 'schoolData' ) ) {
      medianSalary = window.schoolData.medianAnnualPay;
    } else {
      medianSalary = '';
    }

    return medianSalary;
  },

  setMonthlySalary: function( medianSalary ) {
    var monthlySalary;

    if ( medianSalary === '' ) {
      monthlySalary = 0;
    } else {
      monthlySalary = Math.round( Number( medianSalary ) / 12 ).toFixed( 0 );
    }

    return monthlySalary;
  },

  getBLSExpenses: function( values ) {

    // BLS expense data is delivered as annual values.
    // The tool displays monthly expenses.

    if ( window.hasOwnProperty( 'nationalData' ) ) {
      if ( window.nationalData.region === 'Not available' ) {
        values.BLSAverage = 'national';
        values.monthlyRent = window.nationalData.nationalHousing / 12;
        values.monthlyFood = window.nationalData.nationalFood / 12;
        values.monthlyTransportation =
          window.nationalData.nationalTransportation / 12;
        values.monthlyInsurance = window.nationalData.nationalHealthcare / 12;
        values.monthlySavings = window.nationalData.nationalRetirement / 12;
        values.monthlyOther =
          window.nationalData.nationalEntertainment / 12;
      } else {
        values.BLSAverage = window.nationalData.region + ' regional';
        values.monthlyRent = window.nationalData.regionalHousing / 12;
        values.monthlyFood = window.nationalData.regionalFood / 12;
        values.monthlyTransportation =
          window.nationalData.regionalTransportation / 12;
        values.monthlyInsurance = window.nationalData.regionalHealthcare / 12;
        values.monthlySavings = window.nationalData.regionalRetirement / 12;
        values.monthlyOther =
          window.nationalData.regionalEntertainment / 12;
      }
    }

    return values;
  }

};

module.exports = getSchoolValues;
