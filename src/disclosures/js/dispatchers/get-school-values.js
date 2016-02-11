'use strict';

var getSchoolValues = {

  init: function( ) {
    var values = {};

    values.programLength = this.getProgramLength();
    values = this.getGradRate( values );
    values.medianSchoolDebt = this.getMedianSchoolDebt();
    values.defaultRate = this.getDefaultRate();
    values.medianSalary = this.getMedianSalary();
    values.jobRate = Number( window.programData.jobRate );

    return values;
  },

  getProgramLength: function() {
    // Rounds up to the nearest number of years.
    // Might need to change later, to address 18 month or 30 month programs.
    return Math.ceil( window.programData.programLength / 12 ) || '';
  },

  getGradRate: function( schoolValues ) {
    if ( window.programData.completionRate === 'None' ) {
      schoolValues.gradRate = window.schoolData.gradRate;
    } else {
      schoolValues.gradRate = window.programData.completionRate ||
      window.schoolData.gradRate;
    }

    return schoolValues;
  },

  getMedianSchoolDebt: function() {
    return window.programData.medianStudentLoanCompleters ||
    window.schoolData.medianTotalDebt;
  },

  getDefaultRate: function() {
    return window.programData.defaultRate / 100 ||
    window.schoolData.defaultRate;
  },

  getMedianSalary: function() {
    return window.programData.salary || window.schoolData.medianAnnualPay;
  }

};

module.exports = getSchoolValues;
