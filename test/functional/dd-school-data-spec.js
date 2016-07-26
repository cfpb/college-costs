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
  xit( 'should dynamically display the completion rate if it\'s available', function() {
    browser.sleep( 600 );
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionNo();
    browser.sleep( 1000 );
    expect( page.completionRate.getText() ).toEqual( '37' );
  } );

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

  it( 'should dynamically display the graduation cohort content if it\'s available', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=234492&pid=94&oid=740280139f3238cbc9702c7b0d62e5c238a835d0&book=850&gib=6000&gpl=0&hous=20000&insl=0&insi=1&inst=1&mta=4500&othg=2000&othr=500&parl=0&pelg=4000&perl=0&prvf=0&prvi=8&prvl=0&ppl=0&schg=2000&stag=2000&subl=1000&totl=88592&tran=5000&tuit=30000&unsl=1000&wkst=0' );
     browser.sleep( 600 );
     page.confirmVerification();
     browser.sleep( 1000 );
     page.continueStep2();
     browser.sleep( 1000 );
     expect( page.graduationCohortContent.isDisplayed() ).toBeTruthy();
  } );

  it( 'should dynamically hide the graduation cohort content if it\'s not available', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=117113&pid=2765&totl=50000&tuit=30000&hous=20000&book=10000&tran=5000&othr=500&pelg=0&schg=2000&stag=3000&othg=2000&mta=2000&gib=5000&wkst=100&ppl=2110&parl=1234&perl=0&subl=0&unsl=0&gpl=0&prvl=0&prvi=20&prvf=10&insl=10000&insi=4&inst=50&oid=9e0280139f3238cbc9702c7b0d62e5c238a835d0' );
     browser.sleep( 600 );
     page.confirmVerification();
     browser.sleep( 1000 );
     page.continueStep2();
     browser.sleep( 1000 );
     expect( page.graduationCohortContent.isDisplayed() ).toBeFalsy();
  } );

} );
