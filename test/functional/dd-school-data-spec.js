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

  it( 'should graph graudation rates', function() {
    page.confirmVerification();
    expect( page.schoolGradRatePoint.getCssValue( 'bottom' ) ).toEqual( '60.7px' );
    expect( page.schoolGradRateValue.getText() ).toEqual( '37%' );
    expect( page.nationalGradRatePoint.getCssValue( 'bottom' ) ).toEqual( '57.323px' );
    // Checking for z-index lets us know an overlap is being handled correctly
    expect( page.nationalGradRatePoint.getCssValue( 'z-index' ) ).toEqual( '100' );
    expect( page.nationalGradRateValue.getText() ).toEqual( '34%' );
  } );

  it( 'should graph average salary', function() {
    page.confirmVerification();
    expect( page.schoolSalaryPoint.getCssValue( 'bottom' ) ).toEqual( '45.3px' );
    expect( page.schoolSalaryValue.getText() ).toEqual( '$23,000' );
    expect( page.nationalSalaryPoint.getCssValue( 'bottom' ) ).toEqual( '54.188px' );
    expect( page.nationalSalaryValue.getText() ).toEqual( '$31,080' );
  } );

  it( 'should graph loan default rates', function() {
    page.confirmVerification();
    expect( page.schoolDefaultRatePoint.getCssValue( 'bottom' ) ).toEqual( '80.5px' );
    expect( page.schoolDefaultRateValue.getText() ).toEqual( '55%' );
    expect( page.nationalDefaultRatePoint.getCssValue( 'bottom' ) ).toEqual( '35.07px' );
    expect( page.nationalDefaultRateValue.getText() ).toEqual( '14%' );
  } );

} );
