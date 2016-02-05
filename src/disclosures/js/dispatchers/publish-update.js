'use strict';

var financialModel = require( '../models/financial-model' );

var publishUpdate = {

  /**
   * Function which updates financial model with new value
   * @param {string} prop - financial model property name
   * @param {number|string} val - new value
   */
  financialData: function( prop, val ) {
    financialModel.values[prop] = val;
    financialModel.calc( financialModel.values );
  },

  /**
   * Function which updates privateLoanMulti array in financial model with new value
   * @param {number} index - The index of the private loan being updated
   * @param {string} prop - private loan object property name
   * @param {number|string} val - new value
   */
  updatePrivateLoan: function( index, prop, val ) {
    financialModel.values.privateLoanMulti[index][prop] = val;
    financialModel.values.privateLoanMulti[index].amount =
        financialModel.values.privateLoanMulti[index].baseAmount *
        financialModel.values.privateLoanMulti[index].fees / 100;

    financialModel.calc( financialModel.values );
  },

  /**
   * Function which removes a private loan from the privateLoanMulti array
   * @param {number} index - The index of the private loan being removed
   */
  dropPrivateLoan: function( index ) {
    financialModel.values.privateLoanMulti.splice( index, 1 );
    financialModel.calc( financialModel.values );
  },

  /**
   * Function which adds a private loan object to the privateLoanMulti array in financial model
   */
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
