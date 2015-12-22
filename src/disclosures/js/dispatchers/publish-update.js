'use strict';

var financialModel = require( '../models/financial-model' );

var publishUpdate = {
  financialData: function( prop, val ) {
    financialModel.values[prop] = val;
    financialModel.calc( financialModel.values );
  }
};

module.exports = publishUpdate;
