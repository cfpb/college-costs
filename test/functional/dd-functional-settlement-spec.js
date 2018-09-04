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

  it( 'should display the anticipated total direct cost section if passed in the URL', function() {
    browser.wait(
      browser.actions().mouseMove( page.totalDirectCost ).perform(), 10000
    );
    expect( page.totalDirectCost.isDisplayed() ).toBeTruthy();
  } );

  it( 'should hide the anticipated total direct cost section if not passed in the URL', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=182111&pid=1412&oid=9e0280139f3238cbc9702c7b0d62e5c238a835a0&book=650&gib=3000&gpl=1000&hous=3000&insi=4.55&insl=3000&inst=36&mta=3000&othg=100&othr=500&parl=10000&pelg=1500&perl=3000&ppl=1000&prvl=3000&prvf=2.1&prvi=4.55&schg=2000&stag=2000&subl=3500&tran=500&tuit=38976&unsl=2000&wkst=3000' );
    browser.wait(
      browser.actions().mouseMove( page.totalDirectCost ).perform(), 10000
    );
    expect( page.totalDirectCost.isDisplayed() ).toBeFalsy();
  } );

  it( 'should hide the anticipated total direct cost section if the passed URL value is 0', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=182111&pid=1412&oid=9e0280139f3238cbc9702c7b0d62e5c238a835a0&totl=0&book=650&gib=3000&gpl=1000&hous=3000&insi=4.55&insl=3000&inst=36&mta=3000&othg=100&othr=500&parl=10000&pelg=1500&perl=3000&ppl=1000&prvl=3000&prvf=2.1&prvi=4.55&schg=2000&stag=2000&subl=3500&tran=500&tuit=38976&unsl=2000&wkst=3000' );
    browser.wait(
      browser.actions().mouseMove( page.totalDirectCost ).perform(), 10000
    );
    expect( page.totalDirectCost.isDisplayed() ).toBeFalsy();
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
    expect( page.schoolName.getText() ).toEqual( 'The Art Institute of Las Vegas' );
  } );

  it( 'should display the correct name for the college', function() {
    page.confirmVerification();
    getFinancial( 'school' ).then( function( attr ) {
      expect( page.schoolName.getText() ).toEqual( attr );
    } );
  } );

  it( 'should let a student edit the tuition and fees', function() {
    page.confirmVerification();
    expect( page.tuitionFeesCosts.isEnabled() ).toEqual( true );
  } );

  it( 'should show correct totals on load', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then(
      function() {
        page.totalCostOfAttendance.getText().then( function( attr ) {
          attr = cleanNumber( attr );
          expect( getFinancial( 'costOfAttendance' ) ).toEqual( attr );
        } );
        page.studentTotalCost.getText().then( function( attr ) {
          attr = cleanNumber( attr );
          expect( getFinancial( 'firstYearNetCost' ) ).toEqual( attr );
        } );
        page.remainingCostFinal.getText().then( function( attr ) {
          attr = cleanNumber( attr );
          expect( getFinancial( 'gap' ) ).toEqual( attr );
        } );
      }
    );
  } );

  it( 'should properly update when the tuition and fees are modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setTuitionFeesCosts( 20000 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialValue( page, 'tuitionFeesCosts', '20000' );
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the housing and meals are modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setHousingMealsCosts( 5531 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialValue( page, 'housingMealsCosts', '5531' );
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the transportation is modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setTransportationCosts( 998 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialValue( page, 'transportationCosts', '998' );
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the books and supplies are modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setBooksSuppliesCosts( 873 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialValue( page, 'booksSuppliesCosts', '873' );
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the other education costs are modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setOtherEducationCosts( 554 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialValue( page, 'otherEducationCosts', '554' );
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the Federal Pell Grants are modified within the limits', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setFederalPellGrants( 722 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialValue( page, 'federalPellGrants', '722' );
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update and display a warning when the Federal Pell Grants are modified above the Federal limits', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setFederalPellGrants( 99999 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            expect( page.pellGrantCapWarning.isDisplayed() ).toBeTruthy;
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );


  // TODO: Uncomment this once it's built in the JS code
  it( 'should properly update when the grants and scholarships from a school are modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setSchoolScholarships( 3244 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the grants and scholarships from a state are modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setStateScholarships( 3212 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  // TODO: Figure out WHY input on this is broken now. It wasn't before!
  it( 'should properly update when the other grants and scholarships are modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setOtherGrantsScholarships( 2341 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  // TODO: Uncomment this once it's built in the design, HTML, and JS code
  it( 'should properly update when the military assistance is modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setMilitaryTuitionAssistance( 5333 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the GI Bill assistance is modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setGIBill( 3721 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the cash a student will personally provide is modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setStudentContribution( 1643 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the cash a student\'s family will provide is modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setFamilyContribution( 7231 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the Parent PLUS loan is modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setParentPlusContribution( 5621 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the work study earnings are modified within the allowed limit', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setWorkStudyContribution( 2731 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

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

  it( 'should display the origination fee for Direct loans', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.directLoanOriginationFee.getText().then( function( attr ) {
        attr = cleanNumber( attr );
        getFinancial( 'DLOriginationFee' ).then( function( val ) {
          let fee = Math.round( val * 10000 ) / 100;
          expect( fee.toString() ).toEqual( attr );
        } ); 

      } );
    } );
  } );

  it( 'should display the origination fee for grad Plus loans for graduate programs', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=145770&pid=1380&oid=9e0280139f3238cbc9702c7b0d62e5c238a835a0&book=650&gib=3000&gpl=1000&hous=3000&insi=4.55&insl=3000&inst=36&mta=3000&othg=100&othr=500&parl=10000&pelg=1500&perl=3000&ppl=1000&prvl=3000&prvf=2.1&prvi=4.55&schg=2000&stag=2000&subl=3500&totl=62795&tran=500&tuit=60895&unsl=2000&wkst=3000' );
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.plusLoanOriginationFee.getText().then( function( attr ) {
        attr = cleanNumber( attr );
        getFinancial( 'plusOriginationFee' ).then( function( val ) {
          let fee = Math.round( val * 10000 ) / 100;
          expect( fee.toString() ).toEqual( attr );
        } ); 

      } );
    } );
    // browser.wait(
    //   browser.actions().mouseMove( page.directPLUSLoans ).perform().then( function() {
    //     expect( page.plusLoanOriginationFee.getText() ).toEqual( '4.3' );
    //   }), 20000
    // );

  } );

  it( 'should properly hide the federal Perkins loans when the school does not offer it', function() {
    page.confirmVerification();
    browser.sleep( 750 );
    expect( page.federalPerkinsLoans.isDisplayed() ).toBeFalsy();
  } );

  it( 'should properly update when the federal subsidized loans are modified within the allowed limit', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setSubsidizedLoans( 2219 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the federal subsidized loans are modified above the allowed limit', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setSubsidizedLoans( 17231 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the federal unsubsidized loans are modified within the allowed limit', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setUnsubsidizedLoans( 3983 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly update when the federal unsubsidized loans are modified above the allowed limit', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setUnsubsidizedLoans( 19452 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
  } );

  it( 'should properly hide the directPLUS loan option for undergraduate programs', function() {
    page.confirmVerification();
    expect( $( '#contrib__direct-plus' ).isDisplayed() ).toBeFalsy();
  } );

  it( 'should properly update when a private loan is modified', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setPrivateLoanInterestRate( 4.55 );
      page.setPrivateLoanFees( 1 );
      page.setPrivateLoanAmount( 4000 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            checkFinancialText( page, 'remainingCostFinal' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );

      } );
    } );
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

  it( 'should display the tuition payment plan section if passed in the URL', function() {
    page.confirmVerification();
    expect( page.paymentPlanAmount.isDisplayed() ).toBeTruthy();
    expect( page.totalPaymentPlans.isDisplayed() ).toBeTruthy();
  } );

  it( 'should hide the tuition payment plan section if not passed in the URL', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=182111&pid=1412&oid=9e0280139f3238cbc9702c7b0d62e5c238a835a0&book=650&gib=3000&gpl=1000&hous=3000&mta=3000&othg=100&othr=500&parl=10000&pelg=1500&perl=3000&ppl=1000&prvl=3000&prvf=2.1&prvi=4.55&schg=2000&stag=2000&subl=3500&totl=40000&tran=500&tuit=38976&unsl=2000&wkst=3000' );
    page.confirmVerification();
    browser.wait(
      browser.actions().mouseMove( page.paymentPlanAmount ).perform(), 10000
    );
    expect( page.paymentPlanAmount.isDisplayed() ).toBeFalsy();
    expect( page.totalPaymentPlans.isDisplayed() ).toBeFalsy();
  } );

  it( 'should hide the tuition payment plan section if the passed URL value is 0', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=182111&pid=1412&oid=9e0280139f3238cbc9702c7b0d62e5c238a835a0&book=650&gib=3000&gpl=1000&hous=3000&insi=0&insl=0&inst=0&mta=3000&othg=100&othr=500&parl=10000&pelg=1500&perl=3000&ppl=1000&prvl=3000&prvf=2.1&prvi=4.55&schg=2000&stag=2000&subl=3500&totl=40000&tran=500&tuit=38976&unsl=2000&wkst=3000' );
    page.confirmVerification();
    browser.wait(
      browser.actions().mouseMove( page.paymentPlanAmount ).perform(), 10000
    );
    expect( page.paymentPlanAmount.isDisplayed() ).toBeFalsy();
    expect( page.totalPaymentPlans.isDisplayed() ).toBeFalsy();
  } );

  it( 'should display proper debt values', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      checkFinancialText( page, 'totalProgramDebt' );
      checkFinancialText( page, 'totalRepayment' );
    } );
  } );

  it( 'should update total borrowing and verbiage when program length is changed to a whole year number', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setProgramLength( 4 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            expect( page.futureYearsAttending.getText() ).toEqual( 'four years' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );
      } );
    });
  });

  it( 'should update total borrowing and verbiage when program length is changed to a partial year number', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setProgramLength( 4.5 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            expect( page.futureYearsAttending.getText() ).toEqual( 'four and a half years' );
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );
      } );
    });
  });

  it( 'should properly describe a future based on not covering enough of the cost of college that is needed', function() {
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setFamilyContribution( 10000 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeTruthy();
            expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeFalsy();
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );
      } );
    });

  } );

  it( 'should properly describe a future based on covering more of the cost of college that is needed', function() {
   browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=182111&pid=1412&oid=9e0280139f3238cbc9702c7b0d62e5c238a835a0&book=650&gib=3000&gpl=1000&hous=3000&insi=4.55&insl=3000&inst=36&mta=3000&othg=100&othr=500&parl=10000&pelg=1500&perl=3000&ppl=1000&prvl=3000&prvf=2.1&prvi=4.55&schg=2000&stag=2000&subl=3500&tran=500&tuit=38976&unsl=2000&wkst=3000' );
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.setFamilyContribution( 49999 )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            // The numbers update faster than this section, so a slight delay
            // is necessary.
            browser.sleep( 500 );
            expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeFalsy();
            expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeTruthy();
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
        } );
      } );
    });
  } );

  it( 'should properly describe a future based on covering exactly the cost of college that is needed', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=182111&pid=1412&oid=9e0280139f3238cbc9702c7b0d62e5c238a835a0&book=650&gib=3000&gpl=1000&hous=3000&insi=4.55&insl=3000&inst=36&mta=3000&othg=100&othr=500&parl=0&pelg=1500&perl=3000&ppl=1000&prvl=3000&prvf=2.1&prvi=4.55&schg=2000&stag=2000&subl=3500&tran=500&tuit=38976&unsl=2000&wkst=3000' );
    page.confirmVerification();
    waitForNumbers( page )
    .then( function() {
      page.remainingCostFinal.getText()
      .then( function( txt ) {
        txt = Number( cleanNumber( txt ) );
        page.setFamilyContribution( txt )
        .then( function( ) {
          waitForNumbers( page )
          .then( function () {
            // The numbers update faster than this section, so a slight delay
            // is necessary.
            browser.sleep( 500 );
            expect( page.futurePositiveRemainingCost.isDisplayed() ).toBeFalsy();
            expect( page.futureNegativeRemainingCost.isDisplayed() ).toBeFalsy();
            checkFinancialText( page, 'totalCostOfAttendance' );
            checkFinancialText( page, 'studentTotalCost' );
          } );
        } );
      } );
    } );    
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
    waitForExpenses( page )
    .then( function() {
      checkExpenseText( page, 'totalMonthlyLeftOver' );
    } );
  } );

  it( 'should properly change expenses when region is selected', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setExpensesRegion( 'SO' )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly mortage or rent is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyRent( 1151 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly food is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyFood( 675 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly clothing is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyClothing( 133 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly transportation is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyTransportation( 643 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly healthcare expenses are modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyHealthcare( 667 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly entertainment is modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyEntertainment( 221 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly retirement and savings are modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyRetirement( 157 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly taxes are modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyTaxes( 333 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should properly update when estimated monthly other expenses are modified', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.setMonthlyOther( 629 )
    .then( function() {
      waitForExpenses( page )
      .then( function() {
        checkExpenseText( page, 'totalMonthlyLeftOver' );
      } );
    } );
  } );

  it( 'should allow a student who feels that it\'s a good aid offer to go on to Step 3', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionYes();
    browser.sleep( 1000 );
    expect( page.bigQuestionYesButton.getAttribute( 'class' ) ).toEqual( 'a-btn active' );
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
    // In settlement situation, only the settlement content should be displayed...
    expect( page.followupSettlementContent.isDisplayed() ).toBeTruthy();
    expect( page.followupNoNotSureContent.isDisplayed() ).toBeFalsy();
    expect( page.followupYesContent.isDisplayed() ).toBeFalsy();
    expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
    expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  } );

  // NOTE: The "No" option does not appear in settlement schools. This test is not relevant
  // until non-settlement schools are added to the application.
  //
  // it( 'should allow a student who feels that it\'s not a good aid offer to go on to Step 3', function() {
  //   page.confirmVerification();
  //   browser.sleep( 1000 );
  //   page.continueStep2();
  //   browser.sleep( 1000 );
  //   page.answerBigQuestionNo();
  //   browser.sleep( 1000 );
  //   expect( page.bigQuestionNoButton.getAttribute( 'class' ) ).toEqual( 'a-btn a-btn__grouped active' );
  //   expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
  //   // In settlement situation, only the settlement content should be displayed...
  //   expect( page.followupSettlementContent.isDisplayed() ).toBeTruthy();
  //   expect( page.followupNoNotSureContent.isDisplayed() ).toBeFalsy();
  //   expect( page.followupYesContent.isDisplayed() ).toBeFalsy();
  //   expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
  //   expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  // } );

  it( 'should allow a student who is not sure that it\'s a good aid offer to go on to Step 3', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionNotSure();
    browser.sleep( 1000 );
    expect( page.bigQuestionNotSureButton.getAttribute( 'class' ) ).toEqual( 'a-btn active' );
    expect( page.optionsConsiderationsSection.isDisplayed() ).toBeTruthy();
    // In settlement situation, only the settlement content should be displayed...
    expect( page.followupSettlementContent.isDisplayed() ).toBeTruthy();
    expect( page.followupNoNotSureContent.isDisplayed() ).toBeFalsy();
    expect( page.followupYesContent.isDisplayed() ).toBeFalsy();
    expect( page.nextStepsSection.isDisplayed() ).toBeTruthy();
    expect( page.feedbackSection.isDisplayed() ).toBeTruthy();
  } );

  // *** Step 3: Consider your options / A few more things to consider ***
  xit( 'should link to the school website in a new tab', function() {
    browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=182111&pid=1412&oid=fa8283b5b7c939a058889f997949efa566c616a6&book=0&gib=0&gpl=0&hous=5611&insi=5.0&insl=3000&inst=36&mta=0&othg=100&othr=6079&parl=7000&pelg=1500&perl=5500&ppl=0&prvl=2000&prvf=2.1&prvi=4.55&schg=2000&stag=2000&subl=3500&totl=90175&tran=500&tuit=86975&unsl=2000&wkst=1000' )
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionYes();
    browser.sleep( 1000 );
    page.followSchoolLink();
    browser.sleep( 500 );
    browser.getAllWindowHandles()
      .then( function ( handles ) {
        expect( handles.length ).toBe( 2 );
        browser.switchTo().window( handles[1] )
          .then( function () {
            browser.wait( EC.titleContains( 'Art Institutes' ), 8000, 'Page title did not contain "Brown Mackie" within 8 seconds' );
            expect( browser.getCurrentUrl() ).toBe( 'https://www.artinstitutes.edu/las-vegas' );
          } )
          .then( function () {
            browser.close();
            browser.sleep( 750 );
            browser.switchTo().window( handles[0] );
          } );
      } );
  } );

  /* Note: this item was removed from the settlement version of the code */
  // fit( 'should link to the correct College Scorecard search in a new tab', function() {
  //   page.confirmVerification();
  //   browser.sleep( 1000 );
  //   page.continueStep2();
  //   browser.sleep( 1000 );
  //   page.answerBigQuestionNo();
  //   browser.sleep( 1000 );
  //   page.followScorecardLink();
  //   browser.sleep( 1000 );
  //   browser.getAllWindowHandles()
  //     .then( function ( handles ) {
  //       expect( handles.length ).toBe( 2 );
  //       browser.switchTo().window( handles[1] )
  //         .then( function () {
  //           browser.wait( EC.titleContains( 'College Scorecard' ), 8000, 'Page title did not contain "College Scorecard" within 8 seconds' );
  //           browser.sleep( 750 );
  //           expect( element( by.id( 'major' ) ).getAttribute( 'value' ) ).toBe( 'health' );
  //           expect( element( by.id( 'zip-code' ) ).getAttribute( 'value' ) ).toBe( '46805' );
  //           expect( element( by.id( 'search-radius' ) ).getAttribute( 'value' ) ).toBe( '50' );
  //         } )
  //         .then( function () {
  //           browser.close();
  //           browser.sleep( 750 );
  //           browser.switchTo().window( handles[0] );
  //         } );
  //     } );
  // } );

});