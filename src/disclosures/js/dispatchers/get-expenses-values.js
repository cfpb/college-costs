'use strict';

var expensesModel = require( '../models/expenses-model' );

var getExpensesValues = {
  values: function() {
    return expensesModel.values;
  }
};

module.exports = getExpensesValues;
