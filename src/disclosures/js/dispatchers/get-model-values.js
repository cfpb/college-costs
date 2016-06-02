'use strict';

var financialModel = require( '../models/financial-model' );
var schoolModel = require( '../models/school-model' );
var expensesModel = require( '../models/expenses-model' );

var getModel = {
  financial: function() {
    return financialModel.values;
  },
  school: function() {
    return schoolModel.values;
  },
  expenses: function() {
    return expensesModel.values;
  }
};

module.exports = getModel;
