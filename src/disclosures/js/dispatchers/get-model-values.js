'use strict';

var financialModel = require( '../models/financial-model' );
var schoolModel = require( '../models/school-model' );
console.log( 'You are requiring get-model-values so fix that' );

var getModel = {
  financial: function() {
    return financialModel.values;
  },
  school: function() {
    return schoolModel.values;
  }
};

module.exports = getModel;
