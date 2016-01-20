var chai = require( 'chai' );
var expect = chai.expect;
var model = require( '../../src/disclosures/js/models/financial-model' );

describe( 'financial model', function() {

  it( 'sums scholarships', function() {
    model.values = {
      tuitionFees: 9999,
      undergrad: true,
      pellCap: 3750,
      pell: 99,
      otherScholarships: 100,
      schoolGrants: 100,
      stateGrants: 100
    }
    model.calc();
    expect( model.values.scholarships ).to.equal( 300 );
    expect( model.values.grantsTotal ).to.equal( 399 );
  });


});
