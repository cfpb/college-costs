var chai = require( 'chai' );
var expect = chai.expect;
var model = require( '../../src/disclosures/js/models/financial-model' );

describe( 'financial model', function() {

  it( 'sums totals', function() {
    model.values = {
      totalGrantsScholarships: 0,
      scholarships: 100,
      pell: 100,
      totalCost: 0,
      costOfAttendance: 250,
      totalContributions: 0,
      savings: 300,
      family: 300,
      workstudy: 300
    }
    model.sumTotals();
    expect( model.values.totalGrantsScholarships ).to.equal( 200 );
    expect( model.values.totalCost ).to.equal( 50 );
    expect( model.values.totalContributions ).to.equal( 900 );
  });


});
