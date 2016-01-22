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
        { 'loan': 1 },
        { 'loan': 2 },
        { 'loan': 3 }
      ]
    };

    pub.dropPrivateLoan( 1 );
    
    expect( model.values.privateLoanMulti ).to.eql( [ { 'loan': 1 }, { 'loan': 3 } ] );
  });

});
