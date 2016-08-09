'use strict';

var settlementAidOfferPage = function( url ) {
    if ( typeof url !== 'undefined' ) {
      browser.get( url )
    }
    else {
      browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=222938&pid=3266&oid=f38283b5b7c939a058889f997949efa566c616c5&totl=45000&tuit=38976&hous=3000&book=650&tran=500&othr=500&pelg=1500&schg=2000&stag=2000&othg=100&ta=3000&mta=3000&gib=3000&wkst=3000&parl=14000&perl=3000&subl=15000&unsl=2000&ppl=1000&gpl=1000&prvl=3000&prvi=4.55&prvf=1.01&insl=3000&insi=4.55&inst=8' );
    }
};

settlementAidOfferPage.prototype = Object.create({}, {
    verifySection: {
      get: function() {
        return element( by.css( '.verify_wrapper' ) );
      }
    },
    totalDirectCost: {
      get: function() {
        return element( by.id( 'verify_totalDirectCost' ) );
      }
    },
    correctInfoButton: {
      get: function() {
        return element ( by.css( 'a[title="Yes, this information is correct"]' ) );
      }
    },
    incorrectInfoButton: {
      get: function() {
        return element( by.css( 'a[title="No, this is not my information"]' ) );
      }
    },
    confirmVerification: {
      value: function() {
        browser.actions().mouseMove(this.correctInfoButton).click().perform();
      }
    },
    denyVerification: {
      value: function() {
        browser.actions().mouseMove(this.incorrectInfoButton).click().perform();
      }
    },
    correctInfoSection: {
      get: function() {
        return element( by.id( 'info-right' ) );
      }
    },
    incorrectInfoSection: {
      get: function() {
        return element( by.id( 'info-wrong' ) );
      }
    },
    programLengthSelect: {
      get: function() {
        return element ( by.css( '#estimated-years-attending' ) );
      }
    },
    setProgramLength: {
      value: function( length ) {
        return this.programLengthSelect.element( by.css( '[value="' + length + '"]') ).click();
      }
    },
    // Step 1: Review your first year offer
    reviewSection: {
      get: function() {
        return element( by.css( '.review' ) );
      }
    },
    schoolName: {
      get: function() {
        return element( by.id( 'intro__school-name' ) );
      }
    },
    tuitionFeesCosts: {
      get: function() {
        return element( by.id( 'costs__tuition' ) );
      }
    },
    setTuitionFeesCosts: {
      value: function( tuition ) {
        this.tuitionFeesCosts.clear();
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
        this.housingMealsCosts.clear();
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
        this.booksSuppliesCosts.clear();
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
        this.transportationCosts.clear();
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
        this.otherEducationCosts.clear();
        return this.otherEducationCosts.sendKeys( othercosts );
      }
    },
    totalCostOfAttendance: {
      get: function() {
        return element( by.id( 'summary_cost-of-attendance' ) );
      }
    },
    costSummary: {
      get: function() {
        return element( by.css(
            '.offer-part.cost-to-attend .offer-part_summary-wrapper'
        ) );
      }
    },
    federalPellGrants: {
      get: function() {
        return element( by.id( 'grants__pell' ) );
      }
    },
    setFederalPellGrants: {
      value: function(pellgrant) {
        this.federalPellGrants.clear();
        return this.federalPellGrants.sendKeys(pellgrant);
      }
    },
    pellGrantCapWarning: {
      get: function() {
        return element( by.css( '[data-calc-error="pell"]' ) );
      }
    },
    schoolScholarships: {
      get: function() {
        return element( by.id( 'grants__school' ) );
      }
    },
    setSchoolScholarships: {
      value: function(schoolscholarships) {
        this.schoolScholarships.clear();
        return this.schoolScholarships.sendKeys(schoolscholarships);
      }
    },
    stateScholarships: {
      get: function() {
        return element( by.id( 'grants__state' ) );
      }
    },
    setStateScholarships: {
      value: function(statescholarships) {
        this.stateScholarships.clear();
        return this.stateScholarships.sendKeys(statescholarships);
      }
    },
    otherGrantsScholarships: {
      get: function() {
        return element( by.id( 'grants__scholarships' ) );
      }
    },
    setOtherGrantsScholarships: {
      value: function(othergrants) {
        this.otherGrantsScholarships.clear();
        return this.otherGrantsScholarships.sendKeys(othergrants);
      }
    },
    militaryTuitionAssistance: {
      get: function() {
        return element( by.id( 'grants__military' ) );
      }
    },
    setmilitaryTuitionAssistance: {
      value: function(military) {
        this.militaryTuitionAssistance.clear();
        return this.militaryTuitionAssistance.sendKeys(military);
      }
    },
    GIBill: {
      get: function() {
        return element( by.id( 'grants__gi' ) );
      }
    },
    setGIBill: {
      value: function(gibill) {
        this.benefitsGIBill.clear();
        return this.benefitsGIBill.sendKeys(gibill);
      }
    },
    totalGrantsScholarships: {
      get: function() {
        return element( by.id( 'summary_total-grants-scholarships' ) );
      }
    },
    studentTotalCost: {
      get: function() {
        return element( by.id( 'summary_total-cost' ) );
      }
    },
    studentContribution: {
      get: function() {
        return element( by.id( 'contrib__savings' ) );
      }
    },
    setStudentContribution: {
      value: function(studentcontrib) {
        this.studentContribution.clear();
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
        this.familyContribution.clear();
        return this.familyContribution.sendKeys(familycontrib);
      }
    },
    parentPlusContribution: {
      get: function() {
        return element( by.id( 'contrib__parent-plus' ) );
      }
    },
    setParentPlusContribution: {
      value: function(contrib) {
        this.parentPlusContribution.clear();
        return this.parentPlusContribution.sendKeys(contrib);
      }
    },
    workStudyContribution: {
      get: function() {
        return element( by.id( 'contrib__workstudy' ) );
      }
    },
    setWorkStudyContribution: {
      value: function(workstudy) {
        this.workStudyContribution.clear();
        return this.workStudyContribution.sendKeys(workstudy);
      }
    },
    totalContributions: {
      get: function() {
        return element( by.id( 'summary_total-contributions' ) );
      }
    },
    federalPerkinsLoans: {
      get: function() {
        return element( by.id( 'contrib__perkins' ) );
      }
    },
    setFederalPerkinsLoans: {
      value: function(perkins) {
        this.federalPerkinsLoans.clear();
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
        this.subsidizedLoans.clear();
        return this.subsidizedLoans.sendKeys( subsidized );
      }
    },
    directLoanOriginationFee: {
      get: function() {
        return element( by.css( '[data-financial="DLOriginationFee"]' ) );
      }
    },
    unsubsidizedLoans: {
      get: function() {
        return element( by.id( 'contrib__unsubsidized' ) );
      }
    },
    setUnsubsidizedLoans: {
      value: function( unsubsidized ) {
        this.unsubsidizedLoans.clear();
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
        this.directPLUSLoans.clear();
        return this.directPLUSLoans.sendKeys( directplus );
      }
    },
    plusLoanOriginationFee: {
      get: function() {
        return element( by.css( '[data-financial="plusOriginationFee"]' ) );
      }
    },
    totalFederalLoans: {
      get: function() {
        return element( by.id( 'summary_total-federal-loans' ) );
      }
    },
    // TODO: Refactor this here and in the HTML/CSS for multiple private loans?
    privateLoanAmount: {
      get: function() {
        return element( by.css( '[data-private-loan] [data-private-loan_key="amount"]' ) );
      }
    },
    setPrivateLoanAmount: {
      value: function(privateamount) {
        this.privateLoanAmount.clear();
        return this.privateLoanAmount.sendKeys( privateamount );
      }
    },
    privateLoanInterestRate: {
      get: function() {
        return element( by.css( '[data-private-loan] [data-private-loan_key="rate"]' ) );
      }
    },
    setPrivateLoanInterestRate: {
      value: function( privateinterest ) {
        this.privateLoanInterestRate.clear();
        return this.privateLoanInterestRate.sendKeys( privateinterest );
      }
    },
    privateLoanFees: {
      get: function() {
        return element( by.css( '[data-private-loan] [data-private-loan_key="fees"]' ) );
      }
    },
    setPrivateLoanFees: {
      value: function( privatefees ) {
        this.privateLoanFees.clear();
        return this.privateLoanFees.sendKeys(privatefees);
      }
    },
    addPrivateLoanButton: {
      get: function() {
        return element( by.css( 'button.private-loans_add-btn' ) );
      }
    },
    paymentPlanAmount: {
      get: function() {
        return element( by.id( 'contrib__payment-plan' ) );
      }
    },
    setPaymentPlanAmount: {
      value: function(paymentamount) {
        this.paymentPlanAmount.clear();
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
    totalPrivateLoans: {
      get: function() {
        return element( by.id( 'summary_total-private-loans' ) );
      }
    },
    totalPaymentPlans: {
      get: function() {
        return element( by.id( 'summary_total-payment-plans' ) );
      }
    },
    loansSummary: {
      get: function() {
        return element( by.css(
            '.offer-part.loans .offer-part_summary-wrapper'
        ) );
      }
    },
    totalDebt: {
      get: function() {
        return element( by.id( 'summary_total-loans' ) );
      }
    },
    remainingCostContrib: {
      get: function() {
        return element( by.id( 'summary_remaining-cost-after-contrib' ) );
      }
    },
    remainingCostLoans: {
      get: function() {
        return element( by.id( 'summary_remaining-cost-after-loans' ) );
      }
    },
    remainingCostFinal: {
      get: function() {
        return element( by.id( 'summary_remaining-cost-final' ) );
      }
    },
    totalProgramDebt: {
      get: function() {
        return element( by.id( 'summary_total-program-debt' ) );
      }
    },
    totalRepayment: {
      get: function() {
        return element( by.id( 'summary_total-repayment' ) );
      }
    },
    futurePositiveRemainingCost: {
      get: function() {
        return element( by.id( 'future_remaining-cost-positive' ) );
      }
    },
    futureNegativeRemainingCost: {
      get: function() {
        return element( by.id( 'future_remaining-cost-negative' ) );
      }
    },
    futureTotalLoans: {
      get: function() {
        return element( by.id( 'future_total-loans' ) );
      }
    },
    futureYearsAttending: {
      get: function() {
        return element( by.id( 'future_years-attending' ) );
      }
    },
    futureTotalDebt: {
      get: function() {
        return element( by.id( 'future_total-debt' ) );
      }
    },
    // Metrics
    completionRate: {
      get: function() {
        return element( by.id( 'option_completion-rate' ) );
      }
    },
    jobRate: {
      get: function() {
        return element( by.id( 'criteria_job-placement-rate' ) );
      }
    },
    continueStep2Button: {
      get: function() {
        return element( by.css( '.continue_controls button' ) );
      }
    },
    continueStep2: {
      value: function() {
        browser.actions().mouseMove(this.continueStep2Button).click().perform();
      }
    },
    // Step 2: Evaluate your offer
    evaluateSection: {
      get: function() {
        return element( by.css( '.evaluate' ) );
      }
    },
    graduationCohortContent: {
      get: function() {
        return element( by.css( '.content_grad-cohort' ) );
      }
    },
    schoolGradRatePoint: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .bar-graph_point__you' ) );
      }
    },
    schoolGradRateValue: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .bar-graph_point__you .bar-graph_value' ) );
      }
    },
    nationalGradRatePoint: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .bar-graph_point__average' ) );
      }
    },
    nationalGradRateValue: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .bar-graph_point__average .bar-graph_value' ) );
      }
    },
    gradRateNotification: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .metric_notification' ) );
      }
    },
    gradRateLink: {
      get: function() {
        return element( by.css( '.graduation-link' ) );
      }
    },
    followGradRateLink: {
      value: function() {
        this.gradRateLink.click();
      }
    },
    schoolSalaryValue: {
      get: function() {
        return element( by.css( '.salary-and-debt_projection-value [data-financial="medianSalary"]' ) );
      }
    },
    schoolDebtAtRepaymentValue: {
      get: function() {
        return element( by.css( '.salary-and-debt_projection-value [data-financial="totalDebt"]' ) );
      }
    },
    debtBurdenPayment: {
      get: function() {
        return element( by.css( '.debt-equation [data-debt-burden="loanMonthly"]' ) );
      }
    },
    monthlyPaymentLoanLengthToggles: {
      get: function() {
        return element( by.css( '.salary-and-debt [data-term-toggle="debtBurden"]' ) );
      }
    },
    monthlyPaymentLoan10YrsToggle: {
      get: function() {
        return element( by.id( 'monthly-payment_term_10' ) );
      }
    },
    monthlyPaymentLoan25YrsToggle: {
      get: function() {
        return element( by.id( 'monthly-payment_term_25' ) );
      }
    },
    toggleMonthlyPaymentLoanLengthTo10Yrs: {
      value: function() {
        browser.actions().mouseMove( this.monthlyPaymentLoan10YrsToggle ).click().perform();
      }
    },
    toggleMonthlyPaymentLoanLengthTo25Yrs: {
      value: function() {
        browser.actions().mouseMove( this.monthlyPaymentLoan25YrsToggle ).click().perform();
      }
    },
    debtBurdenSalary: {
      get: function() {
        return element( by.css( '.debt-equation [data-debt-burden="monthlySalary"]' ) );
      }
    },
    debtBurdenNotification: {
      get: function() {
        return element( by.css( '.metric.debt-burden .metric_notification' ) );
      }
    },
    debtBurdenLoanLengthToggles: {
      get: function() {
        return element( by.css( '.debt-burden [data-term-toggle="debtBurden"]' ) );
      }
    },
    debtBurdenLoan10YrsToggle: {
      get: function() {
        return element( by.id( 'estimated-debt-burden_term_10' ) );
      }
    },
    debtBurdenLoan25YrsToggle: {
      get: function() {
        return element( by.id( 'estimated-debt-burden_term_25' ) );
      }
    },
    toggleDebtBurdenLoanLengthTo10Yrs: {
      value: function() {
        browser.actions().mouseMove(this.debtBurdenLoan10YrsToggle).click().perform();

      }
    },
    toggleDebtBurdenLoanLengthTo25Yrs: {
      value: function() {
        browser.actions().mouseMove(this.debtBurdenLoan25YrsToggle).click().perform();
      }
    },
    schoolDefaultRatePoint: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .bar-graph_point__you' ) );
      }
    },
    schoolDefaultRateValue: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .bar-graph_point__you .bar-graph_value' ) );
      }
    },
    nationalDefaultRatePoint: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .bar-graph_point__average' ) );
      }
    },
    nationalDefaultRateValue: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .bar-graph_point__average .bar-graph_value' ) );
      }
    },
    defaultRateNotification: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .metric_notification' ) );
      }
    },
    defaultRateLink: {
      get: function() {
        return element( by.css( '.loan-default-link' ) );
      }
    },
    followDefaultRateLink: {
      value: function() {
        this.defaultRateLink.click();
      }
    },
    expensesRegionSelect: {
      get: function() {
        return element ( by.css( '#bls-region-select' ) );
      }
    },
    setExpensesRegion: {
      value: function( region ) {
        return this.expensesRegionSelect.element( by.css( '[value="' + region + '"]') ).click();
      }
    },
    monthlyRent: {
      get: function() {
        return element( by.id( 'expenses__rent' ) );
      }
    },
    setMonthlyRent: {
      value: function( rentamount ) {
        this.monthlyRent.clear();
        return this.monthlyRent.sendKeys( rentamount );
      }
    },
    monthlyFood: {
      get: function() {
        return element( by.id( 'expenses__food' ) );
      }
    },
    setMonthlyFood: {
      value: function( foodamount ) {
        this.monthlyFood.clear();
        return this.monthlyFood.sendKeys( foodamount );
      }
    },
    monthlyClothing: {
      get: function() {
        return element( by.id( 'expenses__clothing' ) );
      }
    },
    setMonthlyClothing: {
      value: function( clothingamount ) {
        this.monthlyClothing.clear();
        return this.monthlyClothing.sendKeys( clothingamount );
      }
    },
    monthlyTransportation: {
      get: function() {
        return element( by.id( 'expenses__transportation' ) );
      }
    },
    setMonthlyTransportation: {
      value: function( transportationamount ) {
        this.monthlyTransportation.clear();
        return this.monthlyTransportation.sendKeys( transportationamount );
      }
    },
    monthlyHealthcare: {
      get: function() {
        return element( by.id( 'expenses__healthcare' ) );
      }
    },
    setMonthlyHealthcare: {
      value: function( healthcareamount ) {
        this.monthlyHealthcare.clear();
        return this.monthlyHealthcare.sendKeys( healthcareamount );
      }
    },
    monthlyEntertainment: {
      get: function() {
        return element( by.id( 'expenses__entertainment' ) );
      }
    },
    setMonthlyEntertainment: {
      value: function( entertainmentamount ) {
        this.monthlyEntertainment.clear();
        return this.monthlyEntertainment.sendKeys( entertainmentamount );
      }
    },
    monthlyRetirement: {
      get: function() {
        return element( by.id( 'expenses__retirement' ) );
      }
    },
    setMonthlyRetirement: {
      value: function( retirementamount ) {
        this.monthlyRetirement.clear();
        return this.monthlyRetirement.sendKeys( retirementamount );
      }
    },
    monthlyTaxes: {
      get: function() {
        return element( by.id( 'expenses__taxes' ) );
      }
    },
    setMonthlyTaxes: {
      value: function( taxesamount ) {
        this.monthlyTaxes.clear();
        return this.monthlyTaxes.sendKeys( taxesamount );
      }
    },
    monthlyOther: {
      get: function() {
        return element( by.id( 'expenses__other' ) );
      }
    },
    setMonthlyOther: {
      value: function( otherexpensesamount ) {
        this.monthlyOther.clear();
        return this.monthlyOther.sendKeys( otherexpensesamount );
      }
    },
    averageMonthlySalary: {
      get: function() {
        return element( by.id( 'summary_monthly-salary' ) );
      }
    },
    totalMonthlyLeftOver: {
      get: function() {
        return element( by.id( 'summary_monthly-left-over' ) );
      }
    },
    bigQuestionSection: {
      get: function() {
        return element ( by.css( '.question' ) );
      }
    },
    bigQuestionYesButton: {
      get: function() {
        return element ( by.id( 'question_answer-yes' ) );
      }
    },
    bigQuestionNoButton: {
      get: function() {
        return element ( by.id( 'question_answer-no' ) );
      }
    },
    bigQuestionNotSureButton: {
      get: function() {
        return element ( by.id( 'question_answer-not-sure' ) );
      }
    },
    answerBigQuestionYes: {
      value: function() {
        this.bigQuestionYesButton.click();
      }
    },
    answerBigQuestionNo: {
      value: function() {
        this.bigQuestionNoButton.click();
      }
    },
    answerBigQuestionNotSure: {
      value: function() {
        this.bigQuestionNotSureButton.click();
      }
    },
    // Step 3: You have options / A few more things to consider
    optionsConsiderationsSection: {
      get: function() {
        return element( by.css( '.get-options' ) );
      }
    },
    followupSettlementContent: {
      get: function() {
        return element( by.css( '.followup__settlement' ) );
      }
    },
    followupNoNotSureContent: {
      get: function() {
        return element( by.css( '.followup__no-not-sure' ) );
      }
    },
    followupYesContent: {
      get: function() {
        return element( by.css( '.followup__yes' ) );
      }
    },
    schoolLink: {
      get: function() {
        return element( by.css( '.school-link' ) );
      }
    },
    followSchoolLink: {
      value: function() {
        this.schoolLink.click();
      }
    },
    scorecardLink: {
      get: function() {
        return element( by.css( '.scorecard-link' ) );
      }
    },
    followScorecardLink: {
      value: function() {
        this.scorecardLink.click();
      }
    },
    nextStepsSection: {
      get: function() {
        return element( by.css( '.next-steps' ) );
      }
    },
    //Feedback
    feedbackSection: {
      get: function() {
        return element( by.css( '.feedback' ) );
      }
    },
    feedbackLink: {
      get: function() {
        return element( by.css( '.feedback .btn' ) );
      }
    },
    followFeedbackLink: {
      value: function() {
        this.feedbackLink.click();
      }
    }

} );

module.exports = settlementAidOfferPage;
