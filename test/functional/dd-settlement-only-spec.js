'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

const getFinancial = require( './utility-scripts.js' ).getFinancial;
const getExpense = require( './utility-scripts.js' ).getExpense;
const cleanNumber = require( './utility-scripts.js' ).cleanNumber;
const waitForCostOfAttendance = require( './utility-scripts.js' ).waitForCostOfAttendance;
const waitForRemainingCost = require( './utility-scripts.js' ).waitForRemainingCost;
const waitForNumbers = require( './utility-scripts.js' ).waitForNumbers;
const waitForExpenses = require( './utility-scripts.js' ).waitForExpenses;
const checkFinancialText = require( './utility-scripts.js' ).checkFinancialText;
const checkFinancialValue = require( './utility-scripts.js' ).checkFinancialValue;
const checkExpenseText = require( './utility-scripts.js' ).checkExpenseText;
const checkExpenseValue = require( './utility-scripts.js' ).checkExpenseValue;

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

  it( 'should not display the graduation rate notification', function() {
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
    expect( page.gradRateLink.getAttribute( 'href' ) ).toEqual( 'https://collegescorecard.ed.gov/school/?182111#graduation' );
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
            browser.wait( EC.titleContains( 'The Art Institute of Las Vegas' ), 8000, 'Page title did not contain "The Art Institute of Las Vegas" within 8 seconds' );
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
    waitForNumbers( page )
    .then( function() {
      page.continueStep2();
      browser.sleep( 500 );
      checkFinancialText( page, 'schoolSalaryValue' );
    });
  } );

  it( 'should calculate debt burden', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.continueStep2();
      browser.sleep( 500 );
      checkFinancialText( page, 'debtBurdenPayment' );
      checkFinancialText( page, 'debtBurdenSalary' );
    });
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
    getFinancial( 'defaultRate' )
    .then( function( rate ) {
      rate = ( rate * 100 ) + '%';
      expect( page.schoolDefaultRateValue.getText() ).toEqual( rate );
    } );

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
    expect( page.defaultRateLink.getAttribute( 'href' ) ).toEqual( 'http://nces.ed.gov/collegenavigator/?id=182111#fedloans' );
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
          } )
          .then( function () {
            browser.close();
            browser.sleep( 750 );
            browser.switchTo().window( handles[0] );
          } );
      } );
  } );

} );
