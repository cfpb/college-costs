'use strict';

var financialModel = require( '../models/financial-model' );

var publishUpdate = {
  financialData: function( prop, val ) {
    // If this is an object, then we're handling a private loan
    if ( typeof prop === 'object' ) {
      var index = prop.index,
          key = prop.key;
      if ( typeof financialModel.values.privateLoanMulti[index] == 'undefined' ) {
        financialModel.values.privateLoanMulti[index] = {};
      }
      financialModel.values.privateLoanMulti[index][key] = val;
    } else {
      financialModel.values[prop] = val;
    }
    financialModel.calc( financialModel.values );
  }
};

module.exports = publishUpdate;
