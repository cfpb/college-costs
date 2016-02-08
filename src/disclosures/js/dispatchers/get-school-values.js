'use strict';

var stringToNum = require( '../utils/handle-string-input' );

var getSchoolValues = {

  var values = {};

  init: function( ) {
    values.programLength = this.getProgramLength();
    values.gradRate = this.getGradRate();
    values.medianDebt = this.getMedianDebt();
    values.defaultRate = this.getDefaultRate();
    values.medianSalary = this.getMedianSalary();

    return values;
  },

  getProgramLength: function() {
    // Rounds up to the nearest number of years.
    // Might need to change later, to address 18 month or 30 month programs.
    return Math.ceil(window.programData.programLength / 12) || '';
  },

  getGradRate: function() {
    if ( window.programData.completionRate == 'None' ) {
      return window.schoolData.gradRate;
    } else {
      return window.programData.completionRate || window.schoolData.gradRate;
    }
  },

  getMedianDebt: function() {
    return window.programData.medianStudentLoanCompleters || window.schoolData.medianMonthlyDebt;
  },

  getDefaultRate: function() {
    return (window.programData.defaultRate / 100) || window.schoolData.defaultRate;
  },

  getMedianSalary: function() {
    return window.programData.salary || window.schoolData.medianAnnualPay;
  }

};

module.exports = getSchoolValues;
