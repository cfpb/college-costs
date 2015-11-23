var chai = require( 'chai' ),
    expect = chai.expect,
    handleStringInput = require( '../../src/disclosures/js/lib/handle-string-input.js' ),
    queryHandler = require( '../../src/disclosures/js/lib/query-handler.js' );

// Testing handle-string-input.js

describe( 'handleStringInput...', function() {

  it( '...will parse number strings with non-numeric characters', function() {
    expect( handleStringInput( '9a99' ) ).to.equal( 999 );
    expect( handleStringInput( 'u123456' ) ).to.equal( 123456 );
    expect( handleStringInput( '01234' ) ).to.equal( 1234 );
    expect( handleStringInput( '$1,234,567' ) ).to.equal( 1234567 );
    expect( handleStringInput( 'Ilikethenumber5' ) ).to.equal( 5 );
    expect( handleStringInput( 'function somefunction() { do badstuff; }' ) ).to.equal( 0 );
  });

  it( '...will parse the first period as a decimal point', function() {
    expect( handleStringInput( '4.22' ) ).to.equal( 4.22 );
    expect( handleStringInput( 'I.like.the.number.5' ) ).to.equal( 0.5 );
    expect( handleStringInput( '1.2.3.4.5.6.7' ) ).to.equal( 1.234567 );
  });

});

// Testing query-handler.js

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