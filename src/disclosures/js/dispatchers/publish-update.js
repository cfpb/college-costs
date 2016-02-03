'use strict';

var financialModel = require( '../models/financial-model' );

var publishUpdate = {
  financialData: function( prop, val ) {
    financialModel.values[prop] = val;
    financialModel.calc( financialModel.values );
  },

  updatePrivateLoan: function( index, prop, val ) {
    financialModel.values.privateLoanMulti[index][prop] = val;
    financialModel.values.privateLoanMulti[index].amount =
        financialModel.values.privateLoanMulti[index].baseAmount +
        financialModel.values.privateLoanMulti[index].fees;
    financialModel.calc( financialModel.values );
  },

  dropPrivateLoan: function( index ) {
    financialModel.values.privateLoanMulti.splice( index, 1 );
    financialModel.calc( financialModel.values );
  },

  addPrivateLoan: function() {
    var newLoanObject = { amount: 0,
                          baseAmount: 0,
                          fees: 0,
                          rate: 0,
                          deferPeriod: 0
                        };
    financialModel.values.privateLoanMulti.push( newLoanObject );
    financialModel.calc( financialModel.values );
  }
};

module.exports = publishUpdate;
