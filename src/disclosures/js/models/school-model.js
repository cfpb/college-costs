'use strict';

var getSchoolValues = require( '../dispatchers/get-school-values' );

var schoolModel = {
  values: {},

  init: function( iped, pid ) {
    this.values = getSchoolValues.init( iped, pid );
  }

};
module.exports = schoolModel;
