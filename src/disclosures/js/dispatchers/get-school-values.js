'use strict';

var getSchoolValues = {

  init: function( ) {
    var values = {};

    values.programLength = this.getProgramLength();
    values.gradRate = this.getGradRate();
    values.medianSchoolDebt = this.getMedianSchoolDebt();
    values.defaultRate = this.getDefaultRate();
    values.medianSalary = this.getMedianSalary();
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
      // Rounds up to the nearest number of years.
      // Might need to change later, to address 18 month or 30 month programs.
      jobRate = Number( window.programData.jobRate ) || '';
    } else {
      jobRate = '';
    }

    return jobRate;
  },

  getGradRate: function() {
    var gradRate = '';
    var schoolAndProgramData = window.hasOwnProperty( 'programData' ) &&
      window.hasOwnProperty( 'schoolData' );
    var schoolNotProgramData = !window.hasOwnProperty( 'programData' ) &&
      window.hasOwnProperty( 'schoolData' );

    if ( schoolAndProgramData ) {
      if ( window.programData.completionRate === 'None' ) {
        gradRate = window.schoolData.gradRate;
      } else {
        gradRate = window.programData.completionRate ||
        window.schoolData.gradRate;
      }
    }
    if ( schoolNotProgramData ) {
      gradRate = window.schoolData.gradRate;
    }

    return gradRate;
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
  }

};

module.exports = getSchoolValues;
