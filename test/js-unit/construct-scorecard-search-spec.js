var chai = require( 'chai' );
var expect = chai.expect;
var scorecardSearch = require( '../../src/disclosures/js/utils/construct-scorecard-search' );

describe( 'construct-scorecard-search', function() {

  it( 'returns a program + location search', function() {
    var pcip = '25',
        zip = '20552',
        radius = '83',
        searchQuery = scorecardSearch( pcip, zip, radius );
    expect( searchQuery ).to.equal( 'search/?major=library&zip=20552&distance=83' );
  });

  it( 'returns a program-only search if no ZIP is given', function() {
    var pcip = '25',
        zip = '',
        searchQuery = scorecardSearch( pcip, zip );
    expect( searchQuery ).to.equal( 'search/?major=library' );
  });

  it( 'returns a location-only search if no PCIP is given', function() {
    var pcip = '',
        zip = '20552',
        radius = '83',
        searchQuery = scorecardSearch( pcip, zip, radius );
    expect( searchQuery ).to.equal( 'search/?zip=20552&distance=83' );
  });

  it( 'returns a location-only search for unknown PCIPs', function() {
    var pcip = '99',
        zip = '20552',
        radius = '83',
        searchQuery = scorecardSearch( '', zip, radius );
    expect( searchQuery ).to.equal( 'search/?zip=20552&distance=83' );
  });

  it( 'defaults to a radius of 50 if radius is not specified', function() {
    var pcip = '25',
        zip = '20552',
        searchQuery = scorecardSearch( pcip, zip );
    expect( searchQuery ).to.equal( 'search/?major=library&zip=20552&distance=50' );
  });

  it( 'returns false if PCIP and ZIP are blank', function() {
    var pcip = '',
        zip = '',
        searchQuery = scorecardSearch( pcip, zip );
    expect( searchQuery ).to.equal( false );
  });

  it( 'returns false if PCIP and ZIP are undefined', function() {
    var pcip = undefined,
        zip = undefined,
        searchQuery = scorecardSearch( pcip, zip );
    expect( searchQuery ).to.equal( false );
  });

  it( 'returns false if PCIP and ZIP are null', function() {
    var pcip = null,
        zip = null,
        searchQuery = scorecardSearch( pcip, zip );
    expect( searchQuery ).to.equal( false );
  });

});
