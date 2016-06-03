'use strict';

var financialModel = require( '../models/financial-model' );

var getFinancialValues = {
  values: function() {
    return financialModel.values;
  }
};

module.exports = getFinancialValues;
