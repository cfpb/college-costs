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
    var count;
    page.confirmVerification();
    browser.sleep( 1000 );
    page.addPrivateLoanButton.click();
    count = element.all( by.css( '.private-loans .private-loans_loan' ) ).count();
    expect( count ).toBe( 2 );
  } );

  it( 'should remove a private loan entry when the loan\'s remove button is clicked', function() {
    var count;
    page.confirmVerification();
    browser.sleep( 1000 );
    element.all( by.css( '.private-loans .private-loans_loan'))
      .last().all( by.css( '.private-loans_remove-btn' ) ).click();
    count = element.all( by.css( '.private-loans .private-loans_loan' ) ).count();
    expect( count ).toBe( 0 );
  } );

  it( 'should add a private loan even after the last private loan is removed', function() {
    var count;
    page.confirmVerification();
    browser.sleep( 1000 );
    element.all( by.css( '.private-loans .private-loans_loan'))
      .last().all( by.css( '.private-loans_remove-btn' ) ).click();
    page.addPrivateLoanButton.click();
    count = element.all( by.css( '.private-loans .private-loans_loan' ) ).count();
    expect( count ).toBe( 1 );
  } );

} );
