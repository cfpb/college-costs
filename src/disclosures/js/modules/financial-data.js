/**
 * Creates an object which represents a model of financial data
 * No parameters or returns.
 */


'use strict';

var FinancialModel = function() {
  var recalculate = require( 'student-debt-calc' );

  this.values = {};

  this.calc = function() {
    this.values = recalculate( this.values );
    return this.values;
  }
};

module.exports = FinancialModel;