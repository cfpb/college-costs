var chai = require( 'chai' );
var expect = chai.expect;
var model = require( '../../src/disclosures/js/models/financial-model' );
var pub = require( '../../src/disclosures/js/dispatchers/publish-update' );


describe( 'publish updates to the model', function() {

  it( 'update the model with new values', function() {
    model.values = {
      pizza: 'veggie',
      coffee: 'black'
    }

    pub.financialData('pizza', 'cheese');
    
    expect( model.values.pizza ).to.equal( 'cheese' );
  });

  it( 'drops private Loans from privateLoanMulti', function() {
    model.values = {
      privateLoanMulti: [
        { 'amount': 1, 'fees': 0, 'deferPeriod': 0, 'rate': 0 },
        { 'amount': 2, 'fees': 0, 'deferPeriod': 0, 'rate': 0 },
        { 'amount': 3, 'fees': 0, 'deferPeriod': 0, 'rate': 0 }
      ]
    };

    pub.dropPrivateLoan( 1 );
    console.log( model.values.privateLoanMulti );
    expect( model.values.privateLoanMulti ).to.eql(
      [
        { 'amount': 1, 'fees': 0, 'deferPeriod': 0, 'rate': 0, 'totalDebt': 4 },
        { 'amount': 3, 'fees': 0, 'deferPeriod': 0, 'rate': 0, 'totalDebt': 12 }
      ] );
  });

});
