'use strict';

var settlementAidOfferPage = function () {
    // TODO: We will need to add offer variables to the end of the following URL.
    browser.get('http://localhost:8000/paying-for-college2/demo/');
};

settlementAidOfferPage.prototype = Object.create({}, {
    verifySection: { get: function () { return element(by.id('verify')); }},
    correctInfoButton: { get: function () { return element(by.css('button[title="Yes, this information is correct"]'])); }},
    incorrectInfoButton: { get: function () { return element(by.css('button[title="No, this is not my information"]'])); }},
    confirmVerification: { value: function () {
        this.correctInfoButton.click();
    } },
    denyVerification: { value: function () {
        this.incorrectInfoButton.click();
    } },
    // Step 1: Review your first year offer
    reviewSection: { get: function () { return element(by.css('.review')); } },
    tuitionFeesCosts: { get: function () { return element(by.id('costs__tuition'])); } },
    setTuitionFeesCosts: { get: function (tuition) { this.tuitionFeesCosts.sendKeys(tuition); } },
    housingMealsCosts: { get: function () { return element(by.id('costs__room-and-board'])); } },
    setHousingMealsCosts: { get: function (housing) { this.housingMealsCosts.sendKeys(housing); } },
    booksSuppliesCosts: { get: function () { return element(by.id('costs__books'])); } },
    setBooksSuppliesCosts: { get: function (books) { this.booksSuppliesCosts.sendKeys(books); } },
    transportationCosts: { get: function () { return element(by.id('costs__transportation'])); } },
    setTransportationCosts: { get: function (transportation) { this.transportationCosts.sendKeys(transportation); } },
    otherEducationCosts: { get: function () { return element(by.id('costs__other'])); } },
    setOtherEducationCosts: { get: function (othercosts) { this.otherEducationCosts.sendKeys(othercosts); } },
    totalCostOfAttendance: { get: function () { return element(by.css('span[data-financial="costOfAttendance"]'])); } },
    federalPellGrants: { get: function () { return element(by.id('grants__pell'])); } },
    setFederalPellGrants: { get: function (pellgrant) { this.federalPellGrants.sendKeys(pellgrant); } },
    schoolScholarships: { get: function () { return element(by.id('grants__school-scholarships'])); } },
    setSchoolScholarships: { get: function (schoolscholarships) { this.schoolScholarships.sendKeys(schoolscholarships); } },
    stateScholarships: { get: function () { return element(by.id('grants__state-scholarships'])); } },
    setStateScholarships: { get: function (statescholarships) { this.stateScholarships.sendKeys(statescholarships); } },
    otherGrantsScholarships: { get: function () { return element(by.id('grants__other-scholarships'])); } },
    setOtherGrantsScholarships: { get: function (othergrants) { this.otherGrantsScholarships.sendKeys(othergrants); } },
    totalGrantsScholarships: { get: function () { return element(by.css('span[data-financial="totalGrantsScholarships"]'])); } },
    studentTotalCost: { get: function () { return element(by.css('span[data-financial="totalCost"]'])); } },
    studentContribution: { get: function () { return element(by.id('contrib__savings'])); } },
    setStudentContribution: { get: function (studentcontrib) { this.studentContribution.sendKeys(studentcontrib); } },
    familyContribution: { get: function () { return element(by.id('contrib__family'])); } },
    setFamilyContribution: { get: function (familycontrib) { this.familyContribution.sendKeys(familycontrib); } },
    workStudyContribution: { get: function () { return element(by.id('contrib__workstudy'])); } },
    setWorkStudyContribution: { get: function (workstudy) { this.workStudyContribution.sendKeys(workstudy); } },
    totalContributions: { get: function () { return element(by.css('span[data-financial="totalContributions"]'])); } },
    federalPerkinsLoans: { get: function () { return element(by.id('contrib__perkins'])); } },
    setFederalPerkinsLoans: { get: function (perkins) { this.federalPerkinsLoans.sendKeys(perkins); } },
    subsidizedLoans: { get: function () { return element(by.id('contrib__subsidized'])); } },
    setSubsidizedLoans: { get: function (subsidized) { this.subsidizedLoans.sendKeys(subsidized); } },
    unsubsidizedLoans: { get: function () { return element(by.id('contrib__unsubsidized'])); } },
    setUnsubsidizedLoans: { get: function (unsubsidized) { this.unsubsidizedLoans.sendKeys(unsubsidized); } },
    directPLUSLoans: { get: function () { return element(by.id('contrib__direct-plus'])); } },
    setDirectPLUSLoans: { get: function (directplus) { this.directPLUSLoans.sendKeys(directplus); } },
    totalFederalLoans: { get: function () { return element(by.css('span[data-financial="totalFederalLoans"]'])); } },
    // TODO: Refactor this here and in the HTML/CSS for multiple private loans?
    privateLoanAmount: { get: function () { return element(by.id('contrib__private-loan'])); } },
    setPrivateLoanAmount: { get: function (privateamount) { this.privateLoanAmount.sendKeys(privateamount); } },
    privateLoanInterestRate: { get: function () { return element(by.id('contrib__private-loan-interest'])); } },
    setPrivateLoanInterestRate: { get: function (privateinterest) { this.privateLoanInterestRate.sendKeys(privateinterest); } },
    privateLoanFees: { get: function () { return element(by.id('contrib__private-loan-fees'])); } },
    setPrivateLoanFees: { get: function (privatefees) { this.privateLoanFees.sendKeys(privatefees); } },
    privateLoanGracePeriod { get: function () { return element(by.id('contrib__private-loan-grace-period'])); } },
    setPrivateLoanGracePeriod: { get: function (privategrace) { this.privateLoanGracePeriod.sendKeys(privategrace); } },
    addPrivateLoanButton { get: function () { return element(by.css('a[title="Add another private loan"]'])); } },
    paymentPlanAmount: { get: function () { return element(by.id('contrib__payment-plan'])); } },
    setPrivateLoanAmount: { get: function (privateamount) { this.privateLoanAmount.sendKeys(privateamount); } },
    paymentPlanInterestRate: { get: function () { return element(by.id('contrib__payment-plan-interest'])); } },
    paymentPlanDueDate: { get: function () { return element(by.id('contrib__payment-plan-due-date'])); } },
    totalPrivateLoansPaymentPlans: { get: function () { return element(by.css('span[data-financial="totalPrivateLoans"]'])); } },
    totalDebt: { get: function () { return element(by.css('span[data-financial="loanTotal"]'])); } },
    remainingCost: { get: function () { return element(by.css('span[data-financial="remainingCost"]'])); } },
    totalProgramDebt: { get: function () { return element(by.css('span[data-financial="totalProgramDebt"]'])); } },
    totalRepayment: { get: function () { return element(by.css('span[data-financial="totalRepayment"]'])); } },
    addUpCostOfAttendance: { value: function () {
        // return the sum of the values of the cost fields
        return ( this.tuitionFeesCosts.val() + this.housingMealsCosts.val() + this.booksSuppliesCosts.val() + this.transportationCosts.val() + this.otherEducationCosts.val() );
    } },
    addUpGrantsScholarships: { value: function () {
        // return the sum of the values of the grant and scholarship fields
        return ( this.federalPellGrants.val() + this.schoolScholarships.val() + this.stateScholarships.val() + this.otherGrantsScholarships.val() );
    } },
    addUpTotalCost: { value: function () {
        // return the sum of the values of the grant and scholarship fields
        return ( this.addUpCostOfAttendance.val() - this.addUpGrantsScholarships.val() );
    } },
    addUpContributions: { value: function () {
        // return the sum of the values of the contribution fields
        return ( this.studentContribution.val() + this.familyContribution.val() + this.workStudyContribution.val() );
    } },
    addUpFederalLoans: { value: function () {
        // return the sum of the values of the federal loan fields
        return ( this.federalPerkinsLoans.val() + this.subsidizedLoans.val() + this.unsubsidizedLoans.val() + this.directPLUSLoans.val() );
    } },
    addUpPrivateLoansPaymentPlans: { value: function () {
        // return the sum of the values of the federal loan fields
        return ( this.privateLoanAmount.val() + this.paymentPlanAmount.val() );
    } },
    addUpTotalDebt: { value: function () {
        // return the sum of the values of the federal loan fields
        return ( this.addUpFederalLoans.val() + this.addUpPrivateLoansPaymentPlans.val() );
    } },
    addUpRemainingCost: { value: function () {
        // return the sum of the values of the federal loan fields
        return ( this.addUpTotalCost.val() - this.addUpContributions.val() - this.addUpTotalDebt.val() );
    } },
    // Step 2: Evaluate your offer
    evaluateSection: { get: function () { return element(by.css('.evaluate')); } },
    // Step 3: You have options / A few more things to consider
    optionsConsiderationsSection: { get: function () { return element(by.css('.get-options')); } },
    
} );

module.exports = settlementAidOfferPage;
