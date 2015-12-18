var chai = require( 'chai' );
var expect = chai.expect;
var model = require( '../../src/disclosures/js/models/financial-model' );
var getModel = require( '../../src/disclosures/js/dispatchers/get-model-values' );


describe( 'get model values', function() {

  model.values = {
    pizza: 'veggie',
    coffee: 'black'
  }

  it( 'will retrieve the model values', function() {
    expect( getModel.financial() ).to.equal( model.values );
  });


});
