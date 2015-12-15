'use strict';

var recalculate = require( 'student-debt-calc' );
var getViewValues = require( '../dispatchers/get-view-values' );

var financialModel = {
  values: {},

  init: function() {
    var val = getViewValues.inputs();
    this.calc ( val );
  },

  calc: function( val ) {
    this.values = recalculate( val );
  }
};
module.exports = financialModel;
