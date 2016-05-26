'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

fdescribe( 'The dynamic financial aid disclosure', function() {
  var page;
  var EC = protractor.ExpectedConditions;

  beforeEach(function() {
    page = new SettlementPage();
  } );

  it( 'should graph graduation rates without national averages', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.schoolGradRatePoint.getCssValue( 'bottom' ) ).toEqual( '60.7px' );
    expect( page.schoolGradRateValue.getText() ).toEqual( '37%' );
    expect( page.nationalGradRatePoint.isDisplayed() ).toBeFalsy();
  } );

  it( 'should not display the graduation rate notification', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.gradRateNotification.isDisplayed() ).toBeFalsy();
  } );

  it( 'should graph average salary without national averages', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.schoolSalaryPoint.getCssValue( 'bottom' ) ).toEqual( '45.3px' );
    // Checking for z-index lets us know an overlap is being handled correctly
    expect( page.schoolSalaryPoint.getCssValue( 'z-index' ) ).toEqual( 'auto' );
    expect( page.schoolSalaryValue.getText() ).toEqual( '$23,000' );
    expect( page.nationalSalaryPoint.isDisplayed() ).toBeFalsy();
  } );

  it( 'should not display the average salary notification', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.salaryNotification.isDisplayed() ).toBeFalsy();
  } );

  it( 'should calculate debt burden', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.debtBurdenPayment.getText() ).toEqual( '$313' );
    expect( page.debtBurdenSalary.getText() ).toEqual( '$1,917' );
  } );

  it( 'should not display the debt burden notification', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.debtBurdenNotification.isDisplayed() ).toBeFalsy();
  } );

  it( 'should graph loan default rates without national averages', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.schoolDefaultRatePoint.getCssValue( 'bottom' ) ).toEqual( '80.5px' );
    expect( page.schoolDefaultRateValue.getText() ).toEqual( '55%' );
    expect( page.nationalDefaultRatePoint.isDisplayed() ).toBeFalsy();
  } );

  it( 'should not display the loan default rate notification', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.defaultRateNotification.isDisplayed() ).toBeFalsy();
  } );

} );
