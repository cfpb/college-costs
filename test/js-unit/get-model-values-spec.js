var chai = require( 'chai' );
var expect = chai.expect;
var financial = require( '../../src/disclosures/js/models/financial-model' );
var expenses = require( '../../src/disclosures/js/models/expenses-model' );
var school = require( '../../src/disclosures/js/models/school-model' );
var getFinancial = require( '../../src/disclosures/js/dispatchers/get-financial-values' );
var getExpenses = require( '../../src/disclosures/js/dispatchers/get-expenses-values' );
var getSchool = require( '../../src/disclosures/js/dispatchers/get-school-values' );


describe( 'get expenses values', function() {

  expenses.values = {
    pizza: 'veggie',
    coffee: 'black'
  }

  it( 'will retrieve the model values', function() {
    expect( getExpenses.values() ).to.equal( expenses.values );
  });


});

describe( 'get financial values', function() {

  financial.values = {
    pizza: 'veggie',
    coffee: 'black'
  }

  it( 'will retrieve the model values', function() {
    expect( getFinancial.values() ).to.equal( financial.values );
  });


});

describe( 'get school values', function() {

  school.values = {
    pizza: 'veggie',
    coffee: 'black'
  }

  it( 'will retrieve the model values', function() {
    expect( getSchool.values() ).to.equal( school.values );
  });


});
