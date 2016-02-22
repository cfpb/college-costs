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

  it( 'should dynamically display the completion rate if it\'s available', function() {
     browser.sleep( 600 );
     page.confirmVerification();
     expect( page.completionRate.getText() ).toEqual( '37' );
  } );

  it( 'should dynamically display the median school or program debt if it\'s available', function() {
     browser.sleep( 600 );
     page.confirmVerification();
     expect( page.medianSchoolDebt.getText() ).toEqual( '24500' );
  } );

  it( 'should dynamically display the expected monthly salary if it\'s available', function() {
     browser.sleep( 600 );
     page.confirmVerification();
     expect( page.averageMonthlySalary.getText() ).toEqual( '1917');
  } );

  it( 'should dynamically display the job rate if it\'s available', function() {
     browser.sleep( 600 );
     page.confirmVerification();
     expect( page.jobRate.getText() ).toEqual( '18' );
  } );

} );
