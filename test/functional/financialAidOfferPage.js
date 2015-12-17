'use strict';

var financialAidOfferPage = function () {
    browser.get('http://localhost:8000/paying-for-college2/demo/');
};

financialAidOfferPage.prototype = Object.create({}, {
    // Step 1: Review your first year offer
    reviewSection: { get: function () { return element(by.css('.review')); } },
    tuitionFeesCosts: { get: function () { return element(by.id('costs__tuition'])); } },
    housingMealsCosts: { get: function () { return element(by.id('costs__room-and-board'])); } },
    booksSuppliesCosts: { get: function () { return element(by.id('costs__books'])); } },
    transportationCosts: { get: function () { return element(by.id('costs__transportation'])); } },
    otherEducationCosts: { get: function () { return element(by.id('costs__other'])); } },
    totalCostOfAttendance: { get: function () { return element(by.css('span[data-financial="costOfAttendance"]'])); } },
    federalPellGrants: { get: function () { return element(by.id('grants__pell'])); } },
    schoolScholarships: { get: function () { return element(by.id('grants__school-scholarships'])); } },
    stateScholarships: { get: function () { return element(by.id('grants__state-scholarships'])); } },
    otherGrantsScholarships: { get: function () { return element(by.id('grants__other-scholarships'])); } },
    totalGrantsScholarships: { get: function () { return element(by.css('span[data-financial="totalGrantsScholarships"]'])); } },
    studentTotalCost: { get: function () { return element(by.css('span[data-financial="totalCost"]'])); } },
    studentContribution: { get: function () { return element(by.id('contrib__savings'])); } },
    familyContribution: { get: function () { return element(by.id('contrib__family'])); } },
    workStudyContribution: { get: function () { return element(by.id('contrib__workstudy'])); } },
    totalContributions: { get: function () { return element(by.css('span[data-financial="totalContributions"]'])); } },
    federalPerkinsLoans: { get: function () { return element(by.id('contrib__perkins'])); } },
    subsidizedLoans: { get: function () { return element(by.id('contrib__subsidized'])); } },
    unsubsidizedLoans: { get: function () { return element(by.id('contrib__unsubsidized'])); } },
    directPLUSLoans: { get: function () { return element(by.id('contrib__direct-plus'])); } },
    totalFederalLoans: { get: function () { return element(by.css('span[data-financial="totalFederalLoans"]'])); } },
    // TODO: Refactor this here and in the HTML/CSS for multiple private loans
    privateLoanAmount: { get: function () { return element(by.id('contrib__private-loan'])); } },
    privateLoanInterestRate: { get: function () { return element(by.id('contrib__private-loan-interest'])); } },
    privateLoanFees: { get: function () { return element(by.id('contrib__private-loan-fees'])); } },
    privateLoanGracePeriod { get: function () { return element(by.id('contrib__private-loan-grace-period'])); } },
    addPrivateLoanButton { get: function () { return element(by.css('a[title="Add another private loan"]'])); } },
    paymentPlanAmount: { get: function () { return element(by.id('contrib__payment-plan'])); } },
    paymentPlanInterestRate: { get: function () { return element(by.id('contrib__payment-plan-interest'])); } },
    paymentPlanDueDate: { get: function () { return element(by.id('contrib__payment-plan-due-date'])); } },
    addUpCostOfAttendanceFields: { value: function () {
        // return the sum of the values of the cost fields
        return ( tuitionFeesCosts.val() + housingMealsCosts.val() + booksSuppliesCosts.val() + transportationCosts.val() + otherEducationCosts.val() );
    } },
    addUpGrantsAndScholarships: { value: function () {
        // return the sum of the values of the grant and scholarship fields
        return ( federalPellGrants.val() + schoolScholarships.val() + stateScholarships.val() + otherGrantsScholarships.val() );
    } },
    addUpContributions: { value: function () {
        // return the sum of the values of the contribution fields
        return ( studentContribution.val() + familyContribution.val() + workStudyContribution.val() );
    } },
    addUpFederalLoans: { value: function () {
        // return the sum of the values of the federal loan fields
        return ( federalPerkinsLoans.val() + subsidizedLoans.val() + unsubsidizedLoans.val() + directPLUSLoans.val() );
    } },
    // Step 2: Evaluate your offer
    evaluateSection: { get: function () { return element(by.css('.evaluate')); } },
    // Step 3: You have options / A few more things to consider
    optionsConsiderationsSection: { get: function () { return element(by.css('.get-options')); } },
    
} );

module.exports = financialAidOfferPage;
