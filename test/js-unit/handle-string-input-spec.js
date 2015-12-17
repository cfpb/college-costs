var chai = require( 'chai' );
var expect = chai.expect;
var handleStringInput = require( '../../src/disclosures/js/utils/handle-string-input.js' );


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
