'use strict';

var financialModel = require( '../models/financial-model' );

var getModel = {
  financial: function() {
    return financialModel.values;
  }
};

module.exports = getModel;
