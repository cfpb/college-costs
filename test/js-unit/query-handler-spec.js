var chai = require( 'chai' );
var expect = chai.expect;
var queryHandler = require( '../../src/disclosures/js/utils/query-handler.js' );

describe( 'queryHandler...', function() {

  it( '...translates abbreviations into values in returned Object', function() {
    var queryString = '?tf=100&rb=101&bk=102&tr=103&oe=104',
        valuePairs = queryHandler( queryString );
    expect( valuePairs.tuitionFees ).to.equal( 100 );
    expect( valuePairs.roomBoard ).to.equal( 101 );
    expect( valuePairs.books ).to.equal( 102 );
    expect( valuePairs.transportation ).to.equal( 103 );
    expect( valuePairs.otherExpenses ).to.equal( 104 );
  });

  it( '...turns strings in the queryString into numbers where applicable', function() {
    var queryString = '?tf=100&rb=101&bk=102&tr=103&oe=104',
        valuePairs = queryHandler( queryString );
    expect( typeof valuePairs.tuitionFees ).to.equal( "number" );
    expect( typeof valuePairs.roomBoard ).to.equal( "number" );
    expect( typeof valuePairs.books ).to.equal( "number" );
    expect( typeof valuePairs.transportation ).to.equal( "number" );
    expect( typeof valuePairs.otherExpenses ).to.equal( "number" );
  });

  it( '...ignores any key which does not appear in keyMaps' , function() {
    var queryString = '?tf=100&rb=101&bk=102&tr=103&oe=104&lol=999&hack=true',
        valuePairs = queryHandler( queryString );
    expect( valuePairs.tuitionFees ).to.equal( 100 );
    expect( valuePairs.roomBoard ).to.equal( 101 );
    expect( valuePairs.books ).to.equal( 102 );
    expect( valuePairs.transportation ).to.equal( 103 );
    expect( valuePairs.otherExpenses ).to.equal( 104 );
  });

});
