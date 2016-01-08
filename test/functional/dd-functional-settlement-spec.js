'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

describe( 'A dynamic financial aid disclosure that\'s required by settlement', function() {
  var page;
  var EC = protractor.ExpectedConditions;

  beforeEach(function() {
    page = new SettlementPage();
  } );

  it( 'should provide a student with the right page', function() {
    expect( browser.getTitle() ).toBe( 'Understanding your financial aid offer > Consumer Financial Protection Bureau' );
  } );

  it( 'should contain an offer ID in the URL', function(){
    expect( browser.getCurrentUrl() ).toContain( 'oid' );
  } );

  it( 'should contain a college ID and a program ID in the URL', function(){
    expect( browser.getCurrentUrl() ).toContain( 'iped' );
    expect( browser.getCurrentUrl() ).toContain( 'pid' );
  } );

  it( 'should contain required aid offer values in the URL', function(){
    expect( browser.getCurrentUrl() ).toContain( 'tuit' );
    expect( browser.getCurrentUrl() ).toContain( 'hous' );
    expect( browser.getCurrentUrl() ).toContain( 'book' );
  } );

  // TODO - Add expectation that other sections are invisible
  it( 'should display the verify offer area and no other sections', function() {
    browser.wait( EC.visibilityOf(page.verifySection ), 8000 );
  } );

  // TODO - Add expectation that verification buttons disappear, and all fields that should be prepopulated actually are, and that Step 3 is still hidden
  it( 'should let a student verify their information and go on to Step 1 and Step 2 of the offer', function() {
    page.confirmVerification();
    browser.wait( EC.visibilityOf(page.reviewSection ), 8000 );
    browser.wait( EC.visibilityOf(page.evaluateSection ), 8000 );
  } );

  // TODO - Add expectation that verification buttons disappear, offer sections are not visible, that next steps for incorrect info are displayed, and that the trigger to notify the school is activated
  it( 'should let a student report incorrect aid offer information', function() {
    page.denyVerification();
  } );

  // *** Step 1: Review your offer ***
  // TODO: After the offer URL implementation conforms to spec, 
  // we should draw values straight from the page based on URL values
  // rather than setting all of them explicitly here.

  // Cost of attendance

  it( 'should properly update when the tuition is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    expect(page.totalCostOfAttendance.getText()).toEqual( '38976' );
    expect(page.studentTotalCost.getText()).toEqual( '38976' );
    expect(page.remainingCost.getText()).toEqual( '38976' );
  } );

  it( 'should properly update when the housing and meals are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    expect(page.totalCostOfAttendance.getText()).toEqual( '41976' );
    expect(page.studentTotalCost.getText()).toEqual( '41976' );
    expect(page.remainingCost.getText()).toEqual( '41976' );
  } );

  it( 'should properly update when the transportation is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    expect(page.totalCostOfAttendance.getText()).toEqual( '42476' );
    expect(page.studentTotalCost.getText()).toEqual( '42476' );
    expect(page.remainingCost.getText()).toEqual( '42476' );
  } );

  it( 'should properly update when the books and supplies are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    expect(page.totalCostOfAttendance.getText()).toEqual( '43126' );
    expect(page.studentTotalCost.getText()).toEqual( '43126' );
    expect(page.remainingCost.getText()).toEqual( '43126' );
  } );

  it( 'should properly update when the other education costs are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    expect(page.totalCostOfAttendance.getText()).toEqual( '43626' );
    expect(page.studentTotalCost.getText()).toEqual( '43626' );
    expect(page.remainingCost.getText()).toEqual( '43626' );
  } );

  // Grants and scholarships

  it( 'should properly update when the Federal Pell Grants are modified within the limits', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    expect(page.totalGrantsScholarships.getText()).toEqual( '5000' );
    expect(page.studentTotalCost.getText()).toEqual( '38626' );
    expect(page.remainingCost.getText()).toEqual( '38626' );
  } );

  // Personal and family contributions

  // Federal loans

  // Private loans and payment plans

  // Big picture summary

  // Debt summary

});
