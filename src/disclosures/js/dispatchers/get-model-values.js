'use strict';

var financialModel = require( '../models/financial-model' );
var schoolModel = require( '../models/school-model' );

var getModel = {
  financial: function() {
    return financialModel.values;
  },
  school: function() {
    return schoolModel.values;
  }
};

module.exports = getModel;
