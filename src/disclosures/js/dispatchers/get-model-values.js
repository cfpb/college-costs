'use strict';

var financialModel = require( '../models/financial-model' );
var financialTotals = require( '../models/financial-totals' );

var getModel = {
  financial: function() {
    return financialModel.values;
  },

  totals: function() {
    return financialTotals.values;
  }
};

module.exports = getModel;
