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
    expect( page.nationalGradRatePoint.isDisplayed() ).toBeFalsy();
  } );

  fit( 'should not display the graduation rate notification', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.gradRateNotification.isDisplayed() ).toBeFalsy();
  } );

  it( 'should contain a link to the College Scorecard graduation rate comparison', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.gradRateLink.getAttribute( 'href' ) ).toEqual( 'https://collegescorecard.ed.gov/school/?408039#graduation' );
  } );

  it( 'should open the link to the College Scorecard graduation rate comparison in a new tab with the graduation rate section open', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.followGradRateLink();
    browser.sleep( 1000 );
    browser.getAllWindowHandles()
      .then( function ( handles ) {
        expect( handles.length ).toBe( 2 );
        browser.switchTo().window( handles[1] )
          .then( function () {
            browser.wait( EC.titleContains( 'Brown Mackie College-Fort Wayne' ), 8000, 'Page title did not contain "Brown Mackie College-Fort Wayne" within 8 seconds' );
            browser.sleep( 750 );
            expect( element( by.id( 'grad-meter' ) ).isDisplayed() ).toBeTruthy();
          } )
          .then( function () {
            browser.close();
            browser.sleep( 750 );
            browser.switchTo().window( handles[0] );
          } );
      } );
  } );

  it( 'should display the first year salary and total debt at repayment', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.schoolSalaryValue.getText() ).toEqual( '$23,000' );
    expect( page.schoolDebtAtRepaymentValue.getText() ).toEqual( '$23,985' );
  } );

  it( 'should calculate debt burden', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.debtBurdenPayment.getText() ).toEqual( '$250' );
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
    expect( page.schoolDefaultRatePoint.getCssValue( 'bottom' ) ).toEqual( '130px' );
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

  it( 'should contain a link to the College Navigator cohort loan default rates', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    browser.wait( EC.visibilityOf( page.defaultRateLink ), 8000 );
    expect( page.defaultRateLink.getAttribute( 'href' ) ).toEqual( 'http://nces.ed.gov/collegenavigator/?id=408039#fedloans' );
  } );

  it( 'should open the link to the College Navigator cohort loan default rates in a new tab with the loan default rates section open', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.followDefaultRateLink();
    browser.sleep( 1000 );
    browser.getAllWindowHandles()
      .then( function ( handles ) {
        expect( handles.length ).toBe( 2 );
        browser.switchTo().window( handles[1] )
          .then( function () {
            browser.wait( EC.titleContains( 'College Navigator' ), 8000, 'Page title did not contain "College Navigator" within 8 seconds' );
            browser.sleep( 750 );
            expect( element( by.id( 'divctl00_cphCollegeNavBody_ucInstitutionMain_ctl11' ) ).isDisplayed() ).toBeTruthy();
          } )
          .then( function () {
            browser.close();
            browser.sleep( 750 );
            browser.switchTo().window( handles[0] );
          } );
      } );
  } );

} );
