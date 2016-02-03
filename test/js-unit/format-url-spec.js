var chai = require( 'chai' );
var expect = chai.expect;
var formatURL = require( '../../src/disclosures/js/utils/format-url' );

describe( 'format-url', function() {

  it( 'formats a URL when it does not start with a protocol', function() {
    var url = 'www.consumerfinance.gov',
        formattedURL = formatURL( url );
    expect( formattedURL ).to.equal( 'http://www.consumerfinance.gov' );
  });

  it( 'formats a URL when it starts with http://', function() {
    var url = 'http://www.consumerfinance.gov',
        formattedURL = formatURL( url );
    expect( formattedURL ).to.equal( 'http://www.consumerfinance.gov' );
  });

  it( 'formats a URL when it starts with https://', function() {
    var url = 'https://www.consumerfinance.gov',
        formattedURL = formatURL( url );
    expect( formattedURL ).to.equal( 'https://www.consumerfinance.gov' );
  });

  it( 'returns false when the URL is blank', function() {
    var url = '',
        formattedURL = formatURL( url );
    expect( formattedURL ).to.equal( false );
  });

  it( 'returns false when the URL is undefined', function() {
    var url = undefined,
        formattedURL = formatURL( url );
    expect( formattedURL ).to.equal( false );
  });

  it( 'returns false when the URL is null', function() {
    var url = null,
        formattedURL = formatURL( url );
    expect( formattedURL ).to.equal( false );
  });

});
