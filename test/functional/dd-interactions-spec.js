'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

fdescribe( 'The college costs worksheet page', function() {
  var page;
  var EC = protractor.ExpectedConditions;

  beforeEach(function() {
    var url = 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/';
    page = new SettlementPage( url );
    browser.driver.wait( function() {
      return browser.driver.getCurrentUrl( function( url ) {
        return /activity/.test( url );
      });
    });
  } );

  // Private Loan Interactions

  it( 'should add a private loan entry when the add button is clicked', function() {
    page.confirmVerification();
    element.all( by.css( '.private-loans .private-loans_loan' ) ).count()
    .then( function( total ) {
      page.addPrivateLoanButton.click();
      element.all( by.css( '.private-loans .private-loans_loan' ) ).count()
      .then( function( newTotal ) {
        expect( newTotal ).toBe( total + 1 );
      } );
    } );
  } );

} );
