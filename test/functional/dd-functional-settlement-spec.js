'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

fdescribe( 'A dynamic financial aid disclosure that\'s required by settlement', function() {
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

  it( 'should display the verify offer area and no other sections', function() {
    expect( page.verifySection.isDisplayed() ).toBeTruthy();
    expect( page.reviewSection.isDisplayed() ).toBeFalsy();
    expect( page.evaluateSection.isDisplayed() ).toBeFalsy();
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeFalsy();
  } );

  // TODO - Add expectation that verification buttons disappear, and all fields that should be prepopulated actually are
  it( 'should let a student verify their information and go on to Step 1 and Step 2 of the offer', function() {
    page.confirmVerification();
    expect( page.reviewSection.isDisplayed() ).toBeTruthy();
    expect( page.evaluateSection.isDisplayed() ).toBeTruthy();
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeFalsy();
  } );

  // TODO - Add expectation that verification buttons disappear, that next steps for incorrect info are displayed, and that the trigger to notify the school is activated
  it( 'should let a student report incorrect aid offer information', function() {
    page.denyVerification();
    expect( page.reviewSection.isDisplayed() ).toBeFalsy();
    expect( page.evaluateSection.isDisplayed() ).toBeFalsy();
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeFalsy();
  } );

  // *** Step 1: Review your offer ***

  // Cost of attendance values onload --
  //  Cost of attendance: $43,626
  //  Grants and scholarships: $11,600
  //  Total Contributions: $18,000 (includes ParentPLUS loan, parent loan)
  //  Total Borrowing: $14,500
  //  Total cost: $36,026
  //  Remaining cost (before loans): $14,026
  //  Remaining cost (after loans): -$474

  it( 'should display the correct name for the college', function() {
    page.confirmVerification();
    expect( page.schoolName.getText() ).toEqual( 'Brown Mackie College-Fort Wayne' );
  } );

  it( 'should not let a student edit the tuition', function() {
    page.confirmVerification();
    expect( page.tuitionFeesCosts.isEnabled() ).toEqual( false );
  } );

  it( 'should show correct totals on load', function() {
    page.confirmVerification();
    expect( page.totalCostOfAttendance.getText() ).toEqual( '43,626' );
    expect( page.studentTotalCost.getText() ).toEqual( '32,026' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-474' );
  } );

  it( 'should properly update when the housing and meals are modified', function() {
    page.confirmVerification();
    page.setHousingMealsCosts( 2000 );
    browser.sleep( 750 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '42,626' );
    expect( page.studentTotalCost.getText() ).toEqual( '31,026' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-1,474' );
  } );

  it( 'should properly update when the transportation is modified', function() {
    page.confirmVerification();
    page.setTransportationCosts( 400 );
    browser.sleep( 750 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '43,526' );
    expect( page.studentTotalCost.getText() ).toEqual( '31,926' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-574' );
  } );

  it( 'should properly update when the books and supplies are modified', function() {
    page.confirmVerification();
    page.setBooksSuppliesCosts( 750 );
    browser.sleep( 750 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '43,726' );
    expect( page.studentTotalCost.getText() ).toEqual( '32,126' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-374' );
  } );

  it( 'should properly update when the other education costs are modified', function() {
    page.confirmVerification();
    page.setOtherEducationCosts( 1000 );
    browser.sleep( 750 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '44,126' );
    expect( page.studentTotalCost.getText() ).toEqual( '32,526' );
    expect( page.remainingCostFinal.getText() ).toEqual( '26' );
  } );

  //  Grants and scholarships onload: $7,600
  //  Total cost: $36,026
  //  Remaining cost: $7,526

  it( 'should properly update when the Federal Pell Grants are modified within the limits', function() {
    page.confirmVerification();
    page.setFederalPellGrants( 5500 );
    browser.sleep( 750 );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '15,600' );
    expect( page.studentTotalCost.getText() ).toEqual( '28,026' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-4,474' );
  } );

  it( 'should properly update when the Federal Pell Grants are modified above the Federal limits', function() {
    page.confirmVerification();
    page.setFederalPellGrants( 10000 );
    browser.sleep( 750 );
    // TODO: expect student is informed about the Pell Grant cap
    // expect( EC.visibilityOf( page.pellGrantCapWarning ) );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '15,915' );
    expect( page.studentTotalCost.getText() ).toEqual( '27,711' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-4,789' );
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
    expect( page.remainingCostFinal.getText() ).toEqual( '0' );
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
    expect( page.remainingCostFinal.getText() ).toEqual( '35896' );
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
    expect( page.remainingCostFinal.getText() ).toEqual( '33896' );
  } ); */

  // TODO: Figure out WHY input on this is broken now. It wasn't before!
  it( 'should properly update when the other grants and scholarships are modified', function() {
    page.confirmVerification();
    page.setOtherGrantsScholarships( 1000 );
    browser.sleep( 750 );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '12,500' );
    expect( page.studentTotalCost.getText() ).toEqual( '31,126' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-1,374' );
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
    expect( page.remainingCostFinal.getText() ).toEqual( '38526' );
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
    expect( page.remainingCostFinal.getText() ).toEqual( '38526' );
  } ); */

  // Personal and family contributions onload: $14,000
  // Total cost: $36,026
  // Remaining cost: $7,526

  it( 'should properly update when the cash a student will personally provide is modified', function() {
    page.confirmVerification();
    page.setStudentContribution( 1500 );
    browser.sleep( 750 );
    expect( page.totalContributions.getText() ).toEqual( '19,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-1,974' );
  } );

  // TODO: Figure out WHY input on this is broken now. It wasn't before!
  it( 'should properly update when the cash a student\'s family will provide is modified', function() {
    page.confirmVerification();
    page.setFamilyContribution( 4000 );
    browser.sleep( 750 );
    expect( page.totalContributions.getText() ).toEqual( '7,000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '10,526' );
  } );

  it( 'should properly update when the work study earnings are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setWorkStudyContribution( 2000 );
    browser.sleep( 750 );
    expect( page.totalContributions.getText() ).toEqual( '17,000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '526' );
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
    expect(page.remainingCostFinal.getText()).toEqual( '38526' );
  } ); */

  // Federal loans onload: $8,500
  // Total debt: $14,500
  // Remaining cost: $7,526
  // TODO: Uncomment ALL program debt and repayment once it's built in the JS


  it( 'should properly update when the federal Perkins loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setFederalPerkinsLoans( 2000 );
    browser.sleep( 750 );
    expect( page.totalFederalLoans.getText() ).toEqual( '7,500' );
    expect( page.totalDebt.getText() ).toEqual( '13,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal Perkins loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setFederalPerkinsLoans( 15000 );
    browser.sleep( 750 );
    // TODO: expect student is informed about the Perkins loan cap
    // expect( EC.visibilityOf( page.perkinsLoanCapWarning ) );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    expect( page.totalFederalLoans.getText() ).toEqual( '11,000' );
    expect( page.totalDebt.getText() ).toEqual( '17,000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-2,974' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal subsidized loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setSubsidizedLoans( 3000 );
    browser.sleep( 750 );
    expect( page.totalFederalLoans.getText() ).toEqual( '8,000' );
    expect( page.totalDebt.getText() ).toEqual( '14,000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '26' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal subsidized loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setSubsidizedLoans( 15000 );
    browser.sleep( 750 );
    // TODO: expect student is informed about the subsidized loan cap
    // expect( EC.visibilityOf( page.subsidizedLoanCapWarning ) );
    expect( page.totalFederalLoans.getText() ).toEqual( '8,500' );
    expect( page.totalDebt.getText() ).toEqual( '14,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-474' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal unsubsidized loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setUnsubsidizedLoans( 3000 );
    browser.sleep( 750 );
    expect( page.totalFederalLoans.getText() ).toEqual( '9,500' );
    expect( page.totalDebt.getText() ).toEqual( '15,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-1,474' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal unsubsidized loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setUnsubsidizedLoans( 15000 );
    browser.sleep( 750 );
    // TODO: expect student is informed about the unsubsidized loan cap
    // expect( EC.visibilityOf( page.unsussidizedLoanCapWarning ) );
    expect( page.totalFederalLoans.getText() ).toEqual( '12,500' );
    expect( page.totalDebt.getText() ).toEqual( '18,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-4,474' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly hide the directPLUS loan option for undergraduate programs', function() {
    page.confirmVerification();
    expect( $( '#contrib__direct-plus' ).isDisplayed() ).toBeFalsy();
  } );


  // TODO: Uncomment this once it's built in the JS code
  /* it( 'should properly update when the federal Direct PLUS loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setDirectPLUSLoans( 1000 );
    expect( page.totalFederalLoans.getText() ).toEqual( '8500' );
    expect( page.totalDebt.getText() ).toEqual( '14500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '7526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } ); */

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
    expect( page.remainingCostFinal.getText() ).toEqual( '18026' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '?' );
    // expect( page.totalRepayment.getText() ).toEqual( '?' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } ); */

  it( 'should properly update when a private loan is modified', function() {
    page.confirmVerification();
    page.setPrivateLoanAmount( 4000 );
    browser.sleep( 750 );
    page.setPrivateLoanInterestRate( 4.55 );
    browser.sleep( 750 );
    page.setPrivateLoanFees( 1 );
    browser.sleep( 750 );
    expect( page.privateLoanInterestRate.getAttribute('value') ).toBeGreaterThan( 0 );
    expect( page.totalPrivateLoansPaymentPlans.getText() ).toEqual( '7,000' );
    expect( page.totalDebt.getText() ).toEqual( '15,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-1,474' );
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
    expect( page.privateLoanInterestRate.getAttribute('value') ).toBeGreaterThan( 0 );
    expect( page.totalPrivateLoansPaymentPlans.getText() ).toEqual( '3000' );
    expect( page.totalDebt.getText() ).toEqual( '12000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '18526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '?' );
    // expect( page.totalRepayment.getText() ).toEqual( '?' );
    // TODO: expect the estimated debt burden is recalculated
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when a private loan is removed', function() {
  } );
*/


  it( 'should display proper debt values', function() {
    browser.sleep( 1000 );
    page.confirmVerification();
    expect( page.totalProgramDebt.getText() ).toEqual( '29,000' );
    expect( page.totalRepayment.getText() ).toEqual( '37,678' );
  } );

  it( 'should update total borrowing and verbiage when program length is changed', function() {
     page.confirmVerification();
     page.setProgramLength( 4 );
     browser.sleep( 1000 );
     expect( page.futureYearsAttending.getText() ).toEqual( 'four' );
     expect( page.totalProgramDebt.getText() ).toEqual( '58,000' );
  });

  it( 'should properly describe a future based on not covering enough of the cost of college that is needed', function() {
    browser.sleep( 1000 );
    page.confirmVerification();
    page.setFamilyContribution( 10000 );
    browser.sleep( 750 );
    expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeTruthy();
    expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeFalsy();
    expect( page.remainingCostFinal.getText() ).toEqual( '4,526' );
    expect( page.futureTotalLoans.getText() ).toEqual( '$14,500' );
    expect( page.futureYearsAttending.getText() ).toEqual( 'two' );
    expect( page.futureTotalDebt.getText() ).toEqual( '$37,678' );
  } );

  it( 'should properly describe a future based on covering more of the cost of college that is needed', function() {
    browser.sleep( 1000 );
    page.confirmVerification();
    browser.sleep( 750 );
    expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeFalsy();
    expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeTruthy();
    expect( page.remainingCostFinal.getText() ).toEqual( '-474' );
    expect( page.futureTotalLoans.getText() ).toEqual( '$14,500' );
    expect( page.futureYearsAttending.getText() ).toEqual( 'two' );
    expect( page.futureTotalDebt.getText() ).toEqual( '$37,678' );
  } );

  it( 'should properly describe a future based on covering exactly the cost of college that is needed', function() {
    browser.sleep( 1000 );
    page.confirmVerification();
    page.setFamilyContribution( 14526 );
    browser.sleep( 750 );
    expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeFalsy();
    expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeFalsy();
    expect( page.remainingCostFinal.getText() ).toEqual( '0' );
    expect( page.futureTotalLoans.getText() ).toEqual( '$14,500' );
    expect( page.futureYearsAttending.getText() ).toEqual( 'two' );
    expect( page.futureTotalDebt.getText() ).toEqual( '$37,678' );
  } );

  // *** Step 2: Evaluate your offer ***

  // TODO: Change monthly left over when student loan payment is added
  it( 'should properly display estimated monthly expenses', function() {
    page.confirmVerification();
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '3,726' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,809' );
  } );

  it( 'should properly update when estimated monthly mortage or rent is modified', function() {
    page.confirmVerification();
    page.setMonthlyRent( 1151 );
    browser.sleep( 750 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '3,526' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,609' );
  } );

  it( 'should properly update when estimated monthly food is modified', function() {
    page.confirmVerification();
    page.setMonthlyFood( 675 );
    browser.sleep( 750 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '3,826' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,909' );
  } );

  it( 'should properly update when estimated monthly transportation is modified', function() {
    page.confirmVerification();
    page.setMonthlyTransportation( 634 );
    browser.sleep( 750 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '3,626' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,709' );
  } );

  it( 'should properly update when estimated monthly insurance is modified', function() {
    page.confirmVerification();
    page.setMonthlyInsurance( 667 );
    browser.sleep( 750 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '4,026' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-2,109' );
  } );

  it( 'should properly update when estimated monthly retirement and savings are modified', function() {
    page.confirmVerification();
    page.setMonthlyRetirement( 169 );
    browser.sleep( 750 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '3,426' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,509' );
  } );

  it( 'should properly update when estimated monthly other expenses are modified', function() {
    page.confirmVerification();
    page.setMonthlyOther( 630 );
    browser.sleep( 750 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '4,126' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-2,209' );
  } );

  it( 'should allow a student who feels that it\'s a good aid offer to go on to Step 3', function() {
    page.confirmVerification();
    page.answerBigQuestionYes();
    browser.sleep( 750 );
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
    expect( page.followupNoNotSureContent.isDisplayed() ).toBeFalsy();
    expect( page.followupYesContent.isDisplayed() ).toBeTruthy();
    expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
    expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  } );

  it( 'should allow a student who feels that it\'s not a good aid offer to go on to Step 3', function() {
    page.confirmVerification();
    page.answerBigQuestionNo();
    browser.sleep( 750 );
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
    expect( page.followupNoNotSureContent.isDisplayed() ).toBeTruthy();
    expect( page.followupYesContent.isDisplayed() ).toBeFalsy();
    expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
    expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  } );

  it( 'should allow a student who is not sure that it\'s a good aid offer to go on to Step 3', function() {
    page.confirmVerification();
    page.answerBigQuestionNotSure();
    browser.sleep( 750 );
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
    expect( page.followupNoNotSureContent.isDisplayed() ).toBeTruthy();
    expect( page.followupYesContent.isDisplayed() ).toBeFalsy();
    expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
    expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  } );

  // *** Step 3: Consider your options / A few more things to consider ***
  it( 'should link to the school website in a new tab', function() {
    page.confirmVerification();
    browser.sleep( 750 );
    page.answerBigQuestionNo();
    browser.sleep( 750 );
    page.followSchoolLink();
    browser.sleep( 750 );
    browser.getAllWindowHandles()
      .then( function ( handles ) {
        expect( handles.length ).toBe( 2 );
        browser.switchTo().window( handles[1] )
          .then( function () {
            browser.wait( EC.titleContains( 'Brown Mackie' ), 8000, 'Page title did not contain "Brown Mackie" within 8 seconds' );
            expect( browser.getCurrentUrl() ).toBe( 'https://www.brownmackie.edu/' );
          } )
          .then( function () {
            browser.close();
            browser.sleep( 750 );
            browser.switchTo().window( handles[0] );
          } );
      } );
  } );

  it( 'should link to the correct College Scorecard search in a new tab', function() {
    page.confirmVerification();
    browser.sleep( 750 );
    page.answerBigQuestionNo();
    browser.sleep( 1000 );
    page.followScorecardLink();
    browser.sleep( 1000 );
    browser.getAllWindowHandles()
      .then( function ( handles ) {
        expect( handles.length ).toBe( 2 );
        browser.switchTo().window( handles[1] )
          .then( function () {
            browser.wait( EC.titleContains( 'College Scorecard' ), 8000, 'Page title did not contain "College Scorecard" within 8 seconds' );
            browser.sleep( 750 );
            expect( element( by.id( 'major' ) ).getAttribute( 'value' ) ).toBe( 'health' );
            expect( element( by.id( 'zip-code' ) ).getAttribute( 'value' ) ).toBe( '46805' );
            expect( element( by.id( 'search-radius' ) ).getAttribute( 'value' ) ).toBe( '50' );
          } )
          .then( function () {
            browser.close();
            browser.sleep( 750 );
            browser.switchTo().window( handles[0] );
          } );
      } );
  } );

});
