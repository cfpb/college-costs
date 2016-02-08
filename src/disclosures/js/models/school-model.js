'use strict';

var getSchoolValues = require( '../dispatchers/get-school-values' );

var schoolModel = {
  values: {},

  init: function() {
    this.values = getSchoolValues.init();
  }

};
module.exports = schoolModel;
