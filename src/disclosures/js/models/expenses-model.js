'use strict';

var expensesModel = {
  values: {},

  /**
   * Initializes this model
   * @param {object} expenses - object containing unformatted API values
   */
  init: function( expenses ) {
    this.values = expenses;
    this.valuesthis.computeValues();
  },

  computeValues: function(this.values) {
    // monthly expenses
    this.values.totalMonthlyExpenses =
      Math.round( this.values.monthlyRent + this.values.monthlyFood +
      this.values.monthlyTransportation + this.values.monthlyInsurance +
      this.values.monthlySavings + this.values.monthlyOther );

    this.values.monthlyLeftover = Math.round( this.values.monthlySalary -
      this.values.totalMonthlyExpenses - this.values.loanMonthly );
  },

  setCurrentValues: function( region, salary ) {

  }

};

module.exports = expensesModel;