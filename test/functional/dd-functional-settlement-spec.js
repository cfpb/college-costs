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
    expect( page.totalCostOfAttendance.getText() ).toEqual( '38976' );
    expect( page.studentTotalCost.getText() ).toEqual( '38976' );
    expect( page.remainingCost.getText() ).toEqual( '38976' );
  } );

  it( 'should properly update when the housing and meals are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '41976' );
    expect( page.studentTotalCost.getText() ).toEqual( '41976' );
    expect( page.remainingCost.getText() ).toEqual( '41976' );
  } );

  it( 'should properly update when the transportation is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '42476' );
    expect( page.studentTotalCost.getText() ).toEqual( '42476' );
    expect( page.remainingCost.getText() ).toEqual( '42476' );
  } );

  it( 'should properly update when the books and supplies are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '43126' );
    expect( page.studentTotalCost.getText() ).toEqual( '43126' );
    expect( page.remainingCost.getText() ).toEqual( '43126' );
  } );

  it( 'should properly update when the other education costs are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '43626' );
    expect( page.studentTotalCost.getText() ).toEqual( '43626' );
    expect( page.remainingCost.getText() ).toEqual( '43626' );
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
    expect( page.totalGrantsScholarships.getText() ).toEqual( '5000' );
    expect( page.studentTotalCost.getText() ).toEqual( '38626' );
    expect( page.remainingCost.getText() ).toEqual( '38626' );
  } );

  it( 'should properly update when the Federal Pell Grants are modified above the Federal limits', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 10000 );
    // TODO: expect student is informed about the Pell Grant cap
    // expect( EC.visibilityOf( page.pellGrantCapWarning ) );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '5730' );
    expect( page.studentTotalCost.getText() ).toEqual( '37896' );
    expect( page.remainingCost.getText() ).toEqual( '37896' );
  } );

  // TODO: Uncomment this once it's built in the JS code
  /* it( 'should properly update when the Federal Pell Grants are modified above the cost of attendance', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 3976 );
    page.setHousingMealsCosts( 1200 );
    page.setTransportationCosts( 0 );
    page.setBooksSuppliesCosts( 0 );
    page.setOtherEducationCosts( 0 );
    page.setFederalPellGrants( 5000 );
    expect( EC.visibilityOf( page.pellGrantCostWarning ) );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '4976' );
    expect( page.studentTotalCost.getText() ).toEqual( '0' );
    expect( page.remainingCost.getText() ).toEqual( '0' );
  } );*/

  // TODO: Uncomment this once it's built in the JS code
  /* it( 'should properly update when the grants and scholarships from a school are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setSchoolScholarships( 2000 );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '7000' );
    expect( page.studentTotalCost.getText() ).toEqual( '35896' );
    expect( page.remainingCost.getText() ).toEqual( '35896' );
  } );

  it( 'should properly update when the grants and scholarships from a state are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setSchoolScholarships( 2000 );
    page.setStateScholarships( 2000 );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '9000' );
    expect( page.studentTotalCost.getText() ).toEqual( '33896' );
    expect( page.remainingCost.getText() ).toEqual( '33896' );
  } ); */

  it( 'should properly update when the other grants and scholarships are modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '5100' );
    expect( page.studentTotalCost.getText() ).toEqual( '38526' );
    expect( page.remainingCost.getText() ).toEqual( '38526' );
  } );

  // TODO: Uncomment this once it's built in the design, HTML, and JS code
  /* it( 'should properly update when the military assistance is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setSchoolScholarships( 2000 );
    page.setStateScholarships( 2000 );
    page.setOtherGrantsScholarships( 100 );
    page.setMilitaryAssistance( 3000 );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '5100' );
    expect( page.studentTotalCost.getText() ).toEqual( '38526' );
    expect( page.remainingCost.getText() ).toEqual( '38526' );
  } );

  it( 'should properly update when the GI Bill assistance is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setSchoolScholarships( 2000 );
    page.setStateScholarships( 2000 );
    page.setOtherGrantsScholarships( 100 );
    page.setMilitaryAssistance( 3000 );
    page.setGIBill( 3000 );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '5100' );
    expect( page.studentTotalCost.getText() ).toEqual( '38526' );
    expect( page.remainingCost.getText() ).toEqual( '38526' );
  } ); */

  // Personal and family contributions

  it( 'should properly update when the cash a student will personally provide is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    expect( page.totalContributions.getText() ).toEqual( '1000' );
    expect( page.remainingCost.getText() ).toEqual( '37526' );
  } );

  it( 'should properly update when the cash a student\'s family will provide is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    expect( page.totalContributions.getText() ).toEqual( '5000' );
    expect( page.remainingCost.getText() ).toEqual( '33526' );
  } );

  it( 'should properly update when the work study earnings are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    expect( page.totalContributions.getText() ).toEqual( '8000' );
    expect( page.remainingCost.getText() ).toEqual( '30526' );
  } );

  // TODO: Uncomment this once it's built in the JS code
  /* it( 'should properly update when the work study earnings are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 100 );
    page.setFamilyContribution( 100 );
    page.setWorkStudyContribution( 100 );
    // TODO: expect student is informed about the work study earnings cap
    // expect( EC.visibilityOf( page.workStudyCapWarning ) );
    expect(page.totalContributions.getText()).toEqual( '38526' );
    expect(page.remainingCost.getText()).toEqual( '38526' );
  } ); */

  // Federal loans
  // TODO: Uncomment ALL program debt and repayment once it's built in the JS

  it( 'should properly update when the federal Perkins loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    page.setFederalPerkinsLoans( 3000 );
    expect( page.totalFederalLoans.getText() ).toEqual( '3000' );
    expect( page.totalDebt.getText() ).toEqual( '3000' );
    expect( page.remainingCost.getText() ).toEqual( '27526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal Perkins loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    page.setFederalPerkinsLoans( 10000 );
    // TODO: expect student is informed about the Perkins loan cap
    // expect( EC.visibilityOf( page.perkinsLoanCapWarning ) );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    expect( page.totalFederalLoans.getText() ).toEqual( '5500' );
    expect( page.totalDebt.getText() ).toEqual( '5500' );
    expect( page.remainingCost.getText() ).toEqual( '25026' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

it( 'should properly update when the federal subsidized loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    page.setFederalPerkinsLoans( 3000 );
    page.setSubsidizedLoans( 3000 );
    expect( page.totalFederalLoans.getText() ).toEqual( '6000' );
    expect( page.totalDebt.getText() ).toEqual( '6000' );
    expect( page.remainingCost.getText() ).toEqual( '24526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal subsidized loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    // Federal loan assumption: independent first-year undergraduate
    page.setFederalPerkinsLoans( 3000 );
    page.setSubsidizedLoans( 15000 );
    // TODO: expect student is informed about the subsidized loan cap
    // expect( EC.visibilityOf( page.subsidizedLoanCapWarning ) );
    expect( page.totalFederalLoans.getText() ).toEqual( '6500' );
    expect( page.totalDebt.getText() ).toEqual( '6500' );
    expect( page.remainingCost.getText() ).toEqual( '24026' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

it( 'should properly update when the federal unsubsidized loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    // Federal loan assumption: independent first-year undergraduate
    page.setFederalPerkinsLoans( 3000 );
    page.setSubsidizedLoans( 3000 );
    page.setUnsubsidizedLoans( 3000 );
    expect( page.totalFederalLoans.getText() ).toEqual( '9000' );
    expect( page.totalDebt.getText() ).toEqual( '9000' );
    expect( page.remainingCost.getText() ).toEqual( '21526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal unsubsidized loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    // Federal loan assumption: independent first-year undergraduate
    page.setFederalPerkinsLoans( 3000 );
    page.setSubsidizedLoans( 3000 );
    page.setUnsubsidizedLoans( 15000 );
    // TODO: expect student is informed about the unsubsidized loan cap
    // expect( EC.visibilityOf( page.unsussidizedLoanCapWarning ) );
    expect( page.totalFederalLoans.getText() ).toEqual( '12500' );
    expect( page.totalDebt.getText() ).toEqual( '12500' );
    expect( page.remainingCost.getText() ).toEqual( '18026' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal Direct PLUS loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    // Federal loan assumption: independent graduate student
    page.setFederalPerkinsLoans( 3000 );
    page.setSubsidizedLoans( 0 );
    page.setUnsubsidizedLoans( 3000 );
    page.setDirectPLUSLoans( 1000 );
    expect( page.totalFederalLoans.getText() ).toEqual( '7000' );
    expect( page.totalDebt.getText() ).toEqual( '7000' );
    expect( page.remainingCost.getText() ).toEqual( '23526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  // TODO: Uncomment this once it's built in the JS code
  /* it( 'should properly update when the federal Direct PLUS loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    // Federal loan assumption: independent graduate student
    page.setFederalPerkinsLoans( 3000 );
    page.setSubsidizedLoans( 0 );
    page.setUnsubsidizedLoans( 3000 );
    page.setDirectPLUSLoans( 150000 );
    // TODO: expect student is informed about the Direct PLUS loan cap
    // expect( EC.visibilityOf( page.directPLUSCapWarning ) );
    expect( page.totalFederalLoans.getText() ).toEqual( '12500' );
    expect( page.totalDebt.getText() ).toEqual( '12500' );
    expect( page.remainingCost.getText() ).toEqual( '18026' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '?' );
    // expect( page.totalRepayment.getText() ).toEqual( '?' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } ); */

  // Private loans and payment plans

  it( 'should properly update when a private loan is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    // Federal loan assumption: independent first-year undergraduate
    page.setFederalPerkinsLoans( 3000 );
    page.setSubsidizedLoans( 3000 );
    page.setUnsubsidizedLoans( 3000 );
    page.setPrivateLoanAmount( 3000 );
    page.setPrivateLoanInterestRate( 4.55 );
    page.setPrivateLoanFees( 1 );
    page.setPrivateLoanGracePeriod( 6 );
    expect( page.privateLoanInterestRate.getAttribute('value') ).toBeGreaterThan( 0 );
    expect( page.totalPrivateLoansPaymentPlans.getText() ).toEqual( '3000' );
    expect( page.totalDebt.getText() ).toEqual( '12000' );
    expect( page.remainingCost.getText() ).toEqual( '18526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '?' );
    // expect( page.totalRepayment.getText() ).toEqual( '?' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

/*

it( 'should properly update when a new private loan is added', function() {
} );

it( 'should properly update when more than one private loans is modified', function() {
    page.confirmVerification();
    page.setTuitionFeesCosts( 38976 );
    page.setHousingMealsCosts( 3000 );
    page.setTransportationCosts( 500 );
    page.setBooksSuppliesCosts( 650 );
    page.setOtherEducationCosts( 500 );
    page.setFederalPellGrants( 5000 );
    page.setOtherGrantsScholarships( 100 );
    // page.setMilitaryAssistance( 3000 );
    // page.setGIBill( 3000 );
    page.setStudentContribution( 1000 );
    page.setFamilyContribution( 4000 );
    page.setWorkStudyContribution( 3000 );
    // Federal loan assumption: independent first-year undergraduate
    page.setFederalPerkinsLoans( 3000 );
    page.setSubsidizedLoans( 3000 );
    page.setUnsubsidizedLoans( 3000 );
    // The following lines need to be modified for multiple private loans.
    // The page model needs modification as well.
    page.setPrivateLoanAmount( 3000 );
    page.setPrivateLoanInterestRate( 4.55 );
    page.setPrivateLoanFees( 1 );
    page.setPrivateLoanGracePeriod( 6 );
    expect( page.privateLoanInterestRate.getAttribute('value') ).toBeGreaterThan( 0 );
    expect( page.totalPrivateLoansPaymentPlans.getText() ).toEqual( '3000' );
    expect( page.totalDebt.getText() ).toEqual( '12000' );
    expect( page.remainingCost.getText() ).toEqual( '18526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '?' );
    // expect( page.totalRepayment.getText() ).toEqual( '?' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } ); 

  it( 'should properly update when a private loan is removed', function() {
  } );

*/

  // *** Step 2: Evaluate your offer ***
  // TODO: Uncomment when API values are coming in and JS is fully hooked up

  it( 'should properly update when estimated monthly mortage or rent is modified', function() {
    page.confirmVerification();
    page.setMonthlyRent( 1150 );
    // expect( page.averageMonthlySalary.getText() ).toEqual( '3200' );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '1150' );
    // expect( page.totalMonthlyLeftOver.getText() ).toEqual( '1850' );
  } );

  it( 'should properly update when estimated monthly food is modified', function() {
    page.confirmVerification();
    page.setMonthlyRent( 1150 );
    page.setMonthlyFood( 400 );
    // expect( page.averageMonthlySalary.getText() ).toEqual( '3200' );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '1550' );
    // expect( page.totalMonthlyLeftOver.getText() ).toEqual( '1450' );
  } );

  it( 'should properly update when estimated monthly transportation is modified', function() {
    page.confirmVerification();
    page.setMonthlyRent( 1150 );
    page.setMonthlyFood( 400 );
    page.setMonthlyTransportation( 500 );
    // expect( page.averageMonthlySalary.getText() ).toEqual( '3200' );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2050' );
    // expect( page.totalMonthlyLeftOver.getText() ).toEqual( '1350' );
  } );

  it( 'should properly update when estimated monthly insurance is modified', function() {
    page.confirmVerification();
    page.setMonthlyRent( 1150 );
    page.setMonthlyFood( 400 );
    page.setMonthlyTransportation( 500 );
    page.setMonthlyInsurance( 200 );
    // expect( page.averageMonthlySalary.getText() ).toEqual( '3200' );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2250' );
    // expect( page.totalMonthlyLeftOver.getText() ).toEqual( '2100' );
  } );

  it( 'should properly update when estimated monthly retirement and savings are modified', function() {
    page.confirmVerification();
    page.setMonthlyRent( 1150 );
    page.setMonthlyFood( 400 );
    page.setMonthlyTransportation( 500 );
    page.setMonthlyInsurance( 200 );
    page.setMonthlyRetirement( 100 );
    // expect( page.averageMonthlySalary.getText() ).toEqual( '3200' );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2350' );
    // expect( page.totalMonthlyLeftOver.getText() ).toEqual( '2100' );
  } );

  it( 'should properly update when estimated monthly other expenses are modified', function() {
    page.confirmVerification();
    page.setMonthlyRent( 1150 );
    page.setMonthlyFood( 400 );
    page.setMonthlyTransportation( 500 );
    page.setMonthlyInsurance( 200 );
    page.setMonthlyRetirement( 100 );
    page.setMonthlyOther( 500 );
    // expect( page.averageMonthlySalary.getText() ).toEqual( '3200' );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2850' );
    // expect( page.totalMonthlyLeftOver.getText() ).toEqual( '2100' );
  } );

});
