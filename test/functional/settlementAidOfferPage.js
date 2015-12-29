'use strict';

var settlementAidOfferPage = function() {
    // TODO: We will need to add offer variables to the end of the following URL.
    browser.get( 'http://localhost:8000/paying-for-college2/demo/?oid=1f9y8w1t6y3q0r' );
};

settlementAidOfferPage.prototype = Object.create({}, {
    verifySection: {
      get: function() {
        return element( by.css( '.verify_wrapper' ) );
      }
    },
    correctInfoButton: {
      get: function() {
        return element ( by.css( 'button[title="Yes, this information is correct"]' ) );
      }
    },
    incorrectInfoButton: {
      get: function() {
        return element( by.css( 'button[title="No, this is not my information"]' ) );
      }
    },
    confirmVerification: {
      value: function() {
        this.correctInfoButton.click();
      }
    },
    denyVerification: {
      value: function() {
        this.incorrectInfoButton.click();
      }
    },
    // Step 1: Review your first year offer
    reviewSection: {
      get: function() {
        return element( by.css( '.review' ) );
      }
    },
    tuitionFeesCosts: {
      get: function() {
        return element( by.id( 'costs__tuition' ) );
      }
    },
    setTuitionFeesCosts: {
      value: function( tuition ) {
        return this.tuitionFeesCosts.sendKeys( tuition );
      }
    },
    housingMealsCosts: {
      get: function() {
        return element( by.id( 'costs__room-and-board' ) );
      }
    },
    setHousingMealsCosts: {
      value: function( housing ) {
        return this.housingMealsCosts.sendKeys( housing );
      }
    },
    booksSuppliesCosts: {
      get: function() {
        return element( by.id( 'costs__books' ) );
      }
    },
    setBooksSuppliesCosts: {
      value: function( books ) {
        return this.booksSuppliesCosts.sendKeys( books );
      }
    },
    transportationCosts: {
      get: function() {
        return element( by.id( 'costs__transportation' ) );
      }
    },
    setTransportationCosts: {
      value: function( transportation ) {
        return this.transportationCosts.sendKeys( transportation );
      }
    },
    otherEducationCosts: {
      get: function() {
        return element( by.id( 'costs__other' ) );
      }
    },
    setOtherEducationCosts: {
      value: function(othercosts) {
        return this.otherEducationCosts.sendKeys( othercosts );
      }
    },
    totalCostOfAttendance: {
      get: function() {
        return element( by.css( 'span[data-financial="costOfAttendance"]' ) );
      }
    },
    federalPellGrants: {
      get: function() {
        return element( by.id( 'grants__pell' ) );
      }
    },
    setFederalPellGrants: {
      value: function(pellgrant) {
        return this.federalPellGrants.sendKeys(pellgrant);
      }
    },
    // TODO - Fix the change in scholarships, once implemented
    /* schoolScholarships: {
    get: function() { return element( by.id( 'grants__school-scholarships' ) ); } },
    setSchoolScholarships: { value: function(schoolscholarships) { return this.schoolScholarships.sendKeys(schoolscholarships); } },
    stateScholarships: { get: function() { return element( by.id( 'grants__state-scholarships' ) ); } },
    setStateScholarships: { value: function(statescholarships) { return this.stateScholarships.sendKeys(statescholarships); } }, */
    otherGrantsScholarships: {
      get: function() {
        return element( by.id( 'grants__scholarships' ) );
      }
    },
    setOtherGrantsScholarships: {
      value: function(othergrants) {
        return this.otherGrantsScholarships.sendKeys(othergrants);
      }
    },
    totalGrantsScholarships: {
      get: function() {
        return element( by.css( 'span[data-financial="totalGrantsScholarships"]' ) );
      }
    },
    studentTotalCost: {
      get: function() {
        return element( by.css( 'span[data-financial="totalCost"]' ) );
      }
    },
    studentContribution: {
      get: function() {
        return element( by.id( 'contrib__savings' ) );
      }
    },
    setStudentContribution: {
      value: function(studentcontrib) {
        return this.studentContribution.sendKeys(studentcontrib);
      }
    },
    familyContribution: {
      get: function() {
        return element( by.id( 'contrib__family' ) );
      }
    },
    setFamilyContribution: {
      value: function(familycontrib) {
        return this.familyContribution.sendKeys(familycontrib);
      }
    },
    workStudyContribution: {
      get: function() {
        return element( by.id( 'contrib__workstudy' ) );
      }
    },
    setWorkStudyContribution: {
      value: function(workstudy) {
        return this.workStudyContribution.sendKeys(workstudy);
      }
    },
    totalContributions: {
      get: function() {
        return element( by.css( 'span[data-financial="totalContributions"]' ) );
      }
    },
    federalPerkinsLoans: {
      get: function() {
        return element( by.id( 'contrib__perkins' ) );
      }
    },
    setFederalPerkinsLoans: {
      value: function(perkins) {
        return this.federalPerkinsLoans.sendKeys(perkins);
      }
    },
    subsidizedLoans: {
      get: function() {
        return element( by.id( 'contrib__subsidized' ) );
      }
    },
    setSubsidizedLoans: {
      value: function( subsidized ) {
        return this.subsidizedLoans.sendKeys( subsidized );
      }
    },
    unsubsidizedLoans: {
      get: function() {
        return element( by.id( 'contrib__unsubsidized' ) );
      }
    },
    setUnsubsidizedLoans: {
      value: function( unsubsidized ) {
        return this.unsubsidizedLoans.sendKeys( unsubsidized );
      }
    },
    directPLUSLoans: {
      get: function() {
        return element( by.id( 'contrib__direct-plus' ) );
      }
    },
    setDirectPLUSLoans: {
      value: function( directplus ) {
        return this.directPLUSLoans.sendKeys( directplus );
      }
    },
    totalFederalLoans: {
      get: function() {
        return element( by.css( 'span[data-financial="totalFederalLoans"]' ) );
      }
    },
    // TODO: Refactor this here and in the HTML/CSS for multiple private loans?
    privateLoanAmount: {
      get: function() {
        return element( by.id( 'contrib__private-loan' ) );
      }
    },
    setPrivateLoanAmount: {
      value: function(privateamount) {
        return this.privateLoanAmount.sendKeys( privateamount );
      }
    },
    privateLoanInterestRate: {
      get: function() {
        return element( by.id( 'contrib__private-loan-interest' ) );
      }
    },
    setPrivateLoanInterestRate: {
      value: function( privateinterest ) {
        return this.privateLoanInterestRate.sendKeys( privateinterest );
      }
    },
    privateLoanFees: {
      get: function() {
        return element( by.id( 'contrib__private-loan-fees' ) );
      }
    },
    setPrivateLoanFees: {
      value: function( privatefees ) {
        return this.privateLoanFees.sendKeys(privatefees);
      }
    },
    privateLoanGracePeriod: {
      get: function() {
        return element( by.id( 'contrib__private-loan-grace-period' ) );
      }
    },
    setPrivateLoanGracePeriod: {
      value: function( privategrace ) {
        return this.privateLoanGracePeriod.sendKeys(privategrace);
      }
    },
    addPrivateLoanButton: {
      get: function() {
        return element( by.css( 'a[title="Add another private loan"]' ) );
      }
    },
    paymentPlanAmount: {
      get: function() {
        return element( by.id( 'contrib__payment-plan' ) );
      }
    },
    setPaymentPlanAmount: {
      value: function(paymentamount) {
        return this.setPaymentPlanAmount.sendKeys( paymentamount );
      }
    },
    paymentPlanInterestRate: {
      get: function() {
        return element( by.id( 'contrib__payment-plan-interest' ) );
      }
    },
    paymentPlanDueDate: {
      get: function() {
        return element( by.id( 'contrib__payment-plan-due-date' ) );
      }
    },
    totalPrivateLoansPaymentPlans: {
      get: function() {
        return element( by.css( 'span[data-financial="totalPrivateLoans"]' ) );
      }
    },
    totalDebt: {
      get: function() {
        return element( by.css( 'span[data-financial="loanTotal"]' ) );
      }
    },
    remainingCost: {
      get: function() {
        return element( by.css( 'span[data-financial="remainingCost"]' ) );
      }
    },
    totalProgramDebt: {
      get: function() {
        return element( by.css( 'span[data-financial="totalProgramDebt"]' ) );
      }
    },
    totalRepayment: {
      get: function() {
        return element( by.css( 'span[data-financial="totalRepayment"]' ) );
      }
    },
    addUpGrantsScholarships: {
      value: function() {
        // return the sum of the values of the grant and scholarship fields
        return ( this.federalPellGrants.value +
            /* this.schoolScholarships.getText() +
            this.stateScholarships.getText() + */
            this.otherGrantsScholarships.value );
      }
    },
    addUpTotalCost: {
      value: function() {
        // return the sum of the values of the grant and scholarship fields
        return ( this.addUpCostOfAttendance() -
            this.addUpGrantsScholarships() );
      }
    },
    addUpContributions: {
      value: function() {
        // return the sum of the values of the contribution fields
        return ( this.studentContribution.value +
            this.familyContribution.value +
            this.workStudyContribution.value );
      }
    },
    addUpFederalLoans: {
      value: function() {
        // return the sum of the values of the federal loan fields
        return ( this.federalPerkinsLoans.getText() +
            this.subsidizedLoans.getText() +
            this.unsubsidizedLoans.getText() +
            this.directPLUSLoans.getText() );
      }
    },
    addUpPrivateLoansPaymentPlans: {
      value: function() {
        // return the sum of the values of the federal loan fields
        return ( this.privateLoanAmount.getText() +
            this.paymentPlanAmount.getText() );
      }
    },
    addUpTotalDebt: {
      value: function() {
        // return the sum of the values of the federal loan fields
        return ( this.addUpFederalLoans() +
            this.addUpPrivateLoansPaymentPlans() );
      }
    },
    addUpRemainingCost: {
      value: function() {
        // return the sum of the values of the federal loan fields
        return ( this.addUpTotalCost() - this.addUpContributions() -
            this.addUpTotalDebt() );
      }
    },
    // Step 2: Evaluate your offer
    evaluateSection: {
      get: function() {
        return element( by.css( '.evaluate' ) );
      }
    },
    // Step 3: You have options / A few more things to consider
    optionsConsiderationsSection: {
      get: function() {
        return element( by.css( '.get-options' ) );
      }
    }

} );

module.exports = settlementAidOfferPage;
