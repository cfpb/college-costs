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
    browser.sleep( 1000 );
    expect( page.totalProgramDebt.getText() ).toEqual( '23,000' );
  } );

  /* Note: this item was removed from the settlement version of the code */
  /* it( 'should dynamically display the completion rate if it\'s available', function() {
    browser.sleep( 600 );
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionNo();
    browser.sleep( 1000 );
    expect( page.completionRate.getText() ).toEqual( '37' );
  } ); */

  it( 'should dynamically display the expected monthly salary if it\'s available', function() {
     browser.sleep( 600 );
     page.confirmVerification();
     browser.sleep( 1000 );
     page.continueStep2();
     browser.sleep( 1000 );
     expect( page.averageMonthlySalary.getText() ).toEqual( '1,917');
  } );

  it( 'should dynamically display the job rate if it\'s available', function() {
     browser.sleep( 600 );
     page.confirmVerification();
     browser.sleep( 1000 );
     page.continueStep2();
     browser.sleep( 1000 );
     expect( page.jobRate.getText() ).toEqual( '18' );
  } );

} );
