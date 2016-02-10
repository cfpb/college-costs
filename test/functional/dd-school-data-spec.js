'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

fdescribe( 'The dynamic financial aid disclosure', function() {
  var page;
  var EC = protractor.ExpectedConditions;

  beforeEach(function() {
    page = new SettlementPage();
  } );

  it( 'should automatically populate the program length if it\'s available', function() {
     browser.sleep( 600 );
     expect( page.programLengthSelect.$('option:checked').getText() ).toMatch( /2 years/ );
     page.confirmVerification();
     expect( page.totalProgramDebt.getText() ).toEqual( '29000' );
  } );

} );
