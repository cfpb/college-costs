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
    browser.sleep( 750 );
    page.answerBigQuestionNo();
    browser.sleep( 750 );
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

  it( 'should graph graudation rates', function() {
    page.confirmVerification();
    expect( page.schoolGradRatePoint.getCssValue( 'bottom' ) ).toEqual( '60.7px' );
    expect( page.schoolGradRateValue.getText() ).toEqual( '37%' );
    expect( page.nationalGradRatePoint.getCssValue( 'bottom' ) ).toEqual( '57.323px' );
    // Checking for z-index lets us know an overlap is being handled correctly
    expect( page.nationalGradRatePoint.getCssValue( 'z-index' ) ).toEqual( '100' );
    expect( page.nationalGradRateValue.getText() ).toEqual( '34%' );
  } );

  it( 'should display the correct graduation rate notification', function() {
    page.confirmVerification();
    expect( page.gradRateNotification.getText() ).toEqual( 'Higher graduation rate than national average' );
    expect( page.gradRateNotification.getAttribute( 'class' ) ).toEqual( 'metric_notification metric_notification__better' );
  } );

  it( 'should graph average salary', function() {
    page.confirmVerification();
    expect( page.schoolSalaryPoint.getCssValue( 'bottom' ) ).toEqual( '45.3px' );
    expect( page.schoolSalaryValue.getText() ).toEqual( '$23,000' );
    expect( page.nationalSalaryPoint.getCssValue( 'bottom' ) ).toEqual( '54.188px' );
    expect( page.nationalSalaryValue.getText() ).toEqual( '$31,080' );
  } );

  it( 'should display the correct average salary notification', function() {
    page.confirmVerification();
    expect( page.salaryNotification.getText() ).toEqual( 'Lower salary than national average' );
    expect( page.salaryNotification.getAttribute( 'class' ) ).toEqual( 'metric_notification metric_notification__worse cf-notification cf-notification__error' );
  } );

  it( 'should graph loan default rates', function() {
    page.confirmVerification();
    expect( page.schoolDefaultRatePoint.getCssValue( 'bottom' ) ).toEqual( '80.5px' );
    expect( page.schoolDefaultRateValue.getText() ).toEqual( '55%' );
    expect( page.nationalDefaultRatePoint.getCssValue( 'bottom' ) ).toEqual( '35.07px' );
    expect( page.nationalDefaultRateValue.getText() ).toEqual( '14%' );
  } );

  it( 'should display the correct loan default rate notification', function() {
    page.confirmVerification();
    expect( page.defaultRateNotification.getText() ).toEqual( 'Higher default rate than national average' );
    expect( page.defaultRateNotification.getAttribute( 'class' ) ).toEqual( 'metric_notification metric_notification__worse cf-notification cf-notification__error' );
  } );

} );
