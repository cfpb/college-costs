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

  it( 'should let a student verify their information and go on to Step 1 of the offer', function() {
    page.confirmVerification();
    browser.sleep( 750 );
    expect( page.correctInfoButton.isDisplayed() ).toBeFalsy();
    expect( page.incorrectInfoButton.isDisplayed() ).toBeFalsy();
    expect( page.correctInfoSection.isDisplayed() ).toBeTruthy();
    expect( page.reviewSection.isDisplayed() ).toBeTruthy();
    expect( page.evaluateSection.isDisplayed() ).toBeFalsy();
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeFalsy();
  } );

  it( 'should let a student report incorrect aid offer information', function() {
    page.denyVerification();
    browser.sleep( 750 );
    expect( page.correctInfoButton.isDisplayed() ).toBeFalsy();
    expect( page.incorrectInfoButton.isDisplayed() ).toBeFalsy();
    expect( page.correctInfoSection.isDisplayed() ).toBeFalsy();
    expect( page.incorrectInfoSection.isDisplayed() ).toBeTruthy();
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
    expect( page.remainingCostFinal.getText() ).toEqual( '2,526' );
  } );

  it( 'should properly update when the housing and meals are modified', function() {
    page.confirmVerification();
    page.setHousingMealsCosts( 2000 );
    browser.sleep( 750 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '42,626' );
    expect( page.studentTotalCost.getText() ).toEqual( '31,026' );
    expect( page.remainingCostFinal.getText() ).toEqual( '1,526' );
  } );

  it( 'should properly update when the transportation is modified', function() {
    page.confirmVerification();
    page.setTransportationCosts( 400 );
    browser.sleep( 750 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '43,526' );
    expect( page.studentTotalCost.getText() ).toEqual( '31,926' );
    expect( page.remainingCostFinal.getText() ).toEqual( '2,426' );
  } );

  it( 'should properly update when the books and supplies are modified', function() {
    page.confirmVerification();
    page.setBooksSuppliesCosts( 750 );
    browser.sleep( 750 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '43,726' );
    expect( page.studentTotalCost.getText() ).toEqual( '32,126' );
    expect( page.remainingCostFinal.getText() ).toEqual( '2,626' );
  } );

  it( 'should properly update when the other education costs are modified', function() {
    page.confirmVerification();
    page.setOtherEducationCosts( 1000 );
    browser.sleep( 750 );
    expect( page.totalCostOfAttendance.getText() ).toEqual( '44,126' );
    expect( page.studentTotalCost.getText() ).toEqual( '32,526' );
    expect( page.remainingCostFinal.getText() ).toEqual( '3,026' );
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
    expect( page.remainingCostFinal.getText() ).toEqual( '-1,474' );
  } );

  it( 'should properly update when the Federal Pell Grants are modified above the Federal limits', function() {
    page.confirmVerification();
    page.setFederalPellGrants( 10000 );
    browser.sleep( 750 );
    // TODO: expect student is informed about the Pell Grant cap
    // expect( EC.visibilityOf( page.pellGrantCapWarning ) );
    expect( page.totalGrantsScholarships.getText() ).toEqual( '15,915' );
    expect( page.studentTotalCost.getText() ).toEqual( '27,711' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-1,789' );
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
    expect( page.remainingCostFinal.getText() ).toEqual( '1,626' );
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

  it( 'should properly update when the cash a student will personally provide is modified', function() {
    page.confirmVerification();
    page.setStudentContribution( 1500 );
    browser.sleep( 750 );
    expect( page.totalContributions.getText() ).toEqual( '19,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '1,026' );
  } );

  it( 'should properly update when the cash a student\'s family will provide is modified', function() {
    page.confirmVerification();
    page.setFamilyContribution( 4000 );
    browser.sleep( 750 );
    expect( page.totalContributions.getText() ).toEqual( '8,000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '12,526' );
  } );

  it( 'should properly update when the Parent PLUS loan is modified', function() {
    page.confirmVerification();
    page.setParentPlusContribution( 2000 );
    browser.sleep( 750 );
    expect( page.totalContributions.getText() ).toEqual( '19,000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '1,526' );
  } );

  it( 'should properly update when the work study earnings are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setWorkStudyContribution( 2000 );
    browser.sleep( 750 );
    expect( page.totalContributions.getText() ).toEqual( '17,000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '3,526' );
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


  // The following tests could be useful for non-settlement, so I'm
  // salvaging it for the future --mistergone
  //
  // it( 'should properly update when the federal Perkins loans are modified within the allowed limit', function() {
  //   page.confirmVerification();
  //   page.setFederalPerkinsLoans( 2000 );
  //   browser.sleep( 750 );
  //   expect( page.totalFederalLoans.getText() ).toEqual( '7,500' );
  //   expect( page.totalDebt.getText() ).toEqual( '13,500' );
  //   expect( page.remainingCostFinal.getText() ).toEqual( '526' );
  //   // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
  //   // expect( page.totalRepayment.getText() ).toEqual( '10000' );
  //   // TODO: expect the est. monthly student loan expense is recalculated
  // } );

  // it( 'should properly update when the federal Perkins loans are modified above the allowed limit', function() {
  //   page.confirmVerification();
  //   page.setFederalPerkinsLoans( 15000 );
  //   browser.sleep( 750 );
  //   // TODO: expect student is informed about the Perkins loan cap
  //   // expect( EC.visibilityOf( page.perkinsLoanCapWarning ) );
  //   // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
  //   expect( page.totalFederalLoans.getText() ).toEqual( '11,000' );
  //   expect( page.totalDebt.getText() ).toEqual( '17,000' );
  //   expect( page.remainingCostFinal.getText() ).toEqual( '-2,974' );
  //   // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
  //   // expect( page.totalRepayment.getText() ).toEqual( '10000' );
  //   // TODO: expect the est. monthly student loan expense is recalculated
  // } );

  it( 'should properly hide the federal Perkins loans when the school does not offer it', function() {
    page.confirmVerification();
    browser.sleep( 750 );
    expect( page.federalPerkinsLoans.isDisplayed() ).toBeFalsy();
  } );

  it( 'should properly update when the federal subsidized loans are modified within the allowed limit', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.setSubsidizedLoans( 3000 );
    browser.sleep( 1000 );
    expect( page.totalFederalLoans.getText() ).toEqual( '5,000' );
    expect( page.totalDebt.getText() ).toEqual( '11,000' );
    expect( page.remainingCostFinal.getText() ).toEqual( '3,026' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal subsidized loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setSubsidizedLoans( 15000 );
    browser.sleep( 750 );
    // TODO: expect student is informed about the subsidized loan cap
    // expect( EC.visibilityOf( page.subsidizedLoanCapWarning ) );
    expect( page.totalFederalLoans.getText() ).toEqual( '5,500' );
    expect( page.totalDebt.getText() ).toEqual( '11,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '2,526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal unsubsidized loans are modified within the allowed limit', function() {
    page.confirmVerification();
    page.setUnsubsidizedLoans( 3000 );
    browser.sleep( 750 );
    expect( page.totalFederalLoans.getText() ).toEqual( '6,500' );
    expect( page.totalDebt.getText() ).toEqual( '12,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '1,526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
    // TODO: expect the est. monthly student loan expense is recalculated
  } );

  it( 'should properly update when the federal unsubsidized loans are modified above the allowed limit', function() {
    page.confirmVerification();
    page.setUnsubsidizedLoans( 15000 );
    browser.sleep( 750 );
    // TODO: expect student is informed about the unsubsidized loan cap
    // expect( EC.visibilityOf( page.unsussidizedLoanCapWarning ) );
    expect( page.totalFederalLoans.getText() ).toEqual( '9,500' );
    expect( page.totalDebt.getText() ).toEqual( '15,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '-1,474' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '3000' );
    // expect( page.totalRepayment.getText() ).toEqual( '10000' );
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
    expect( page.totalDebt.getText() ).toEqual( '12,500' );
    expect( page.remainingCostFinal.getText() ).toEqual( '1,526' );
    // expect( page.totalProgramDebt.getText() ).toEqual( '?' );
    // expect( page.totalRepayment.getText() ).toEqual( '?' );
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
    expect( page.totalProgramDebt.getText() ).toEqual( '23,000' );
    expect( page.totalRepayment.getText() ).toEqual( '29,971' );
  } );

  it( 'should update total borrowing and verbiage when program length is changed to a whole year number', function() {
     page.confirmVerification();
     page.setProgramLength( 4 );
     browser.sleep( 1000 );
     expect( page.futureYearsAttending.getText() ).toEqual( 'four' );
     expect( page.totalProgramDebt.getText() ).toEqual( '46,000' );
  });

  it( 'should update total borrowing and verbiage when program length is changed to a partial year number', function() {
     page.confirmVerification();
     page.setProgramLength( 4.5 );
     browser.sleep( 1000 );
     expect( page.futureYearsAttending.getText() ).toEqual( 'four and a half' );
     expect( page.totalProgramDebt.getText() ).toEqual( '51,750' );
  });

  it( 'should properly describe a future based on not covering enough of the cost of college that is needed', function() {
    browser.sleep( 1000 );
    page.confirmVerification();
    page.setFamilyContribution( 10000 );
    browser.sleep( 750 );
    expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeTruthy();
    expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeFalsy();
    expect( page.remainingCostFinal.getText() ).toEqual( '6,526' );
    expect( page.futureTotalLoans.getText() ).toEqual( '$11,500' );
    expect( page.futureYearsAttending.getText() ).toEqual( 'two' );
    expect( page.futureTotalDebt.getText() ).toEqual( '$29,971' );
  } );

  it( 'should properly describe a future based on covering more of the cost of college that is needed', function() {
    browser.sleep( 1000 );
    page.confirmVerification();
    page.setFamilyContribution( 25000 );
    browser.sleep( 750 );
    expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeFalsy();
    expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeTruthy();
    expect( page.remainingCostFinal.getText() ).toEqual( '-8,474' );
    expect( page.futureTotalLoans.getText() ).toEqual( '$11,500' );
    expect( page.futureYearsAttending.getText() ).toEqual( 'two' );
    expect( page.futureTotalDebt.getText() ).toEqual( '$29,971' );
  } );

  it( 'should properly describe a future based on covering exactly the cost of college that is needed', function() {
    browser.sleep( 1000 );
    page.confirmVerification();
    page.setFamilyContribution( 16526 );
    browser.sleep( 750 );
    expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeFalsy();
    expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeFalsy();
    expect( page.remainingCostFinal.getText() ).toEqual( '0' );
    expect( page.futureTotalLoans.getText() ).toEqual( '$11,500' );
    expect( page.futureYearsAttending.getText() ).toEqual( 'two' );
    expect( page.futureTotalDebt.getText() ).toEqual( '$29,971' );
  } );

  it( 'should let a student continue on to Step 2', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.reviewSection.isDisplayed() ).toBeTruthy();
    expect( page.evaluateSection.isDisplayed() ).toBeTruthy();
    expect( page.bigQuestionSection.isDisplayed() ).toBeTruthy();
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeFalsy();
  } );

  // *** Step 2: Evaluate your offer ***
  it( 'should properly display estimated monthly expenses', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2,611' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-944' );
  } );

  it( 'should properly change expenses when region is selected', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setExpensesRegion( 'SO' );
    browser.sleep( 500 );
    expect( page.monthlyRent.getAttribute('value') ).toEqual( '$912')
  } );

  it( 'should properly update when estimated monthly mortage or rent is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyRent( 1151 );
    browser.sleep( 1000 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2,853' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,186' );
  } );

  it( 'should properly update when estimated monthly food is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyFood( 675 );
    browser.sleep( 750 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2,916' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,249' );
  } );

  it( 'should properly update when estimated monthly transportation is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyTransportation( 634 );
    browser.sleep( 1000 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2,736' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,069' );
  } );

  it( 'should properly update when estimated monthly insurance is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyInsurance( 667 );
    browser.sleep( 1000 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '3,011' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,344' );
  } );

  it( 'should properly update when estimated monthly retirement and savings are modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyRetirement( 169 );
    browser.sleep( 1000 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2,674' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,007' );
  } );

  it( 'should properly update when estimated monthly other expenses are modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyOther( 630 );
    browser.sleep( 1000 );
    expect( page.totalMonthlyExpenses.getText() ).toEqual( '2,897' );
    expect( page.totalMonthlyLeftOver.getText() ).toEqual( '-1,230' );
  } );

  it( 'should allow a student who feels that it\'s a good aid offer to go on to Step 3', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionYes();
    browser.sleep( 1000 );
    expect( page.bigQuestionYesButton.getAttribute( 'class' ) ).toEqual( 'btn btn__grouped active' );
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
    expect( page.followupNoNotSureContent.isDisplayed() ).toBeFalsy();
    expect( page.followupYesContent.isDisplayed() ).toBeTruthy();
    expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
    expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  } );

  it( 'should allow a student who feels that it\'s not a good aid offer to go on to Step 3', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionNo();
    browser.sleep( 1000 );
    expect( page.bigQuestionNoButton.getAttribute( 'class' ) ).toEqual( 'btn btn__grouped-first active' );
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
    expect( page.followupNoNotSureContent.isDisplayed() ).toBeTruthy();
    expect( page.followupYesContent.isDisplayed() ).toBeFalsy();
    expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
    expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  } );

  it( 'should allow a student who is not sure that it\'s a good aid offer to go on to Step 3', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionNotSure();
    browser.sleep( 1000 );
    expect( page.bigQuestionNotSureButton.getAttribute( 'class' ) ).toEqual( 'btn btn__grouped-last active' );
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
    expect( page.followupNoNotSureContent.isDisplayed() ).toBeTruthy();
    expect( page.followupYesContent.isDisplayed() ).toBeFalsy();
    expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
    expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  } );

  // *** Step 3: Consider your options / A few more things to consider ***
  it( 'should link to the school website in a new tab', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionNo();
    browser.sleep( 1000 );
    page.followSchoolLink();
    browser.sleep( 1000 );
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

  /* Note: this item was removed from the settlement version of the code */
  xit( 'should link to the correct College Scorecard search in a new tab', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
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
