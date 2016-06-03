'use strict';

var schoolModel = require( '../models/school-model' );

var getSchoolValues = {
  values: function() {
    return schoolModel.values;
  }
};

module.exports = getSchoolValues;
