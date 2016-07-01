'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

fdescribe( 'The college costs worksheet page', function() {
  var page;
  var EC = protractor.ExpectedConditions;

  beforeEach(function() {
    page = new SettlementPage();
  } );

  // Sticky summary interactions

  it( 'should pin an offer summary to the top of the window on screens larger than x-small', function() {
    browser.driver.manage().window().setSize(700, 700);
    page.confirmVerification();
    browser.sleep(1000);
    browser.wait(
      page.federalPellGrants.getLocation().then( function( pellGrantsLocation ) {
        browser.executeScript(
            'window.scrollTo(0,' + pellGrantsLocation.y + ')'
        )
      } ), 10000
    );
    expect( page.costSummary.getAttribute( 'class' ) ).toMatch(/\bis_stuck\b/);
    expect( page.costSummary.getAttribute( 'class' ) ).not.toMatch(/\bis_bottomed\b/);
  } );

  it( 'should pin the correct offer summary to the top of the window on screens larger than x-small', function() {
    browser.driver.manage().window().setSize(700, 900);
    page.confirmVerification();
    browser.sleep(1000);
    browser.wait(
      page.unsubsidizedLoans.getLocation().then( function( unsubsLocation ) {
        browser.executeScript(
            'window.scrollTo(0,' + unsubsLocation.y + ')'
        )
      } ), 10000
    );
    expect( page.loansSummary.getAttribute( 'class' ) ).toMatch(/\bis_stuck\b/);
    expect( page.loansSummary.getAttribute( 'class' ) ).not.toMatch(/\bis_bottomed\b/);
  } );

  it( 'should not pin an offer summary on x-small screens', function() {
    browser.driver.manage().window().setSize(500, 800);
    page.confirmVerification();
    browser.sleep(1000);
    browser.wait(
      page.GIBill.getLocation().then( function( GIBillLocation ) {
        browser.executeScript(
            'window.scrollTo(0,' + GIBillLocation.y + ')'
        )
      } ), 10000
    );
    expect( page.costSummary.getAttribute( 'class' ) ).not.toMatch(/\bis_stuck\b/);
    expect( page.costSummary.getAttribute( 'class' ) ).not.toMatch(/\bis_bottomed\b/);
  } );

  // Private loan interactions

  it( 'should add a private loan entry when the add button is clicked', function() {
    var count;
    page.confirmVerification();
    browser.sleep( 1000 );
    browser.wait(
      browser.actions().mouseMove( page.addPrivateLoanButton ).perform().then(
        function() {
          page.addPrivateLoanButton.click();
          count = element.all( by.css( '.private-loans .private-loans_loan' ) ).count();
          expect( count ).toBe( 2 );
        }
      ), 10000
    );
  } );

  it( 'should remove a private loan entry when the loan\'s remove button is clicked', function() {
    var count;
    page.confirmVerification();
    browser.sleep( 1000 );
    browser.wait(
      browser.actions().mouseMove( page.privateLoanAmount ).perform().then(
        function() {
          element.all( by.css( '.private-loans .private-loans_loan'))
          .last().all( by.css( '.private-loans_remove-btn' ) ).click();
          count = element.all( by.css( '.private-loans .private-loans_loan' ) ).count();
          expect( count ).toBe( 0 );
        }
      ), 10000
    );
  } );

  it( 'should add a private loan even after the last private loan is removed', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    browser.wait(
      browser.actions().mouseMove( page.paymentPlanAmount ).perform().then(
        function() {
          element.all( by.css( '.private-loans .private-loans_loan'))
          .last().all( by.css( '.private-loans_remove-btn' ) ).click();
        }
      ), 10000
    );
    page.addPrivateLoanButton.click();
    browser.wait(
      element.all( by.css( '.private-loans .private-loans_loan' ) ).count().then(
        function( count ) {
          expect( count ).toBe( 1 );
        }
      ), 10000
    );
  } );

  // Loan repayment toggle interactions

  it( 'should show the loan payment toggles in Step 2 if federal loans are over $30k', function() {
    browser.actions().mouseMove(page.programLengthSelect).perform();
    page.setProgramLength( 6 );
    browser.actions().mouseMove(page.correctInfoButton).perform();
    page.confirmVerification();
    browser.actions().mouseMove(page.subsidizedLoans).perform();
    page.setSubsidizedLoans( 3500 );
    browser.actions().mouseMove(page.unsubsidizedLoans).perform();
    page.setUnsubsidizedLoans( 6000 );
    browser.sleep( 3000 );
    browser.actions().mouseMove(page.continueStep2Button).perform();
    page.continueStep2();
    browser.actions().mouseMove(page.monthlyPaymentLoanLengthToggles).perform();
    expect( page.monthlyPaymentLoanLengthToggles.isDisplayed() ).toBeTruthy();
    browser.actions().mouseMove(page.debtBurdenLoanLengthToggles).perform();
    expect( page.debtBurdenLoanLengthToggles.isDisplayed() ).toBeTruthy();
  } );

  it( 'should hide the loan payment toggles in Step 2 if federal loans are $30k or less', function() {
    page.setProgramLength( 2 );
    page.confirmVerification();
    browser.actions().mouseMove(page.subsidizedLoans).perform();
    page.setSubsidizedLoans( 1000 );
    browser.actions().mouseMove(page.unsubsidizedLoans).perform();
    page.setUnsubsidizedLoans( 1000 );
    browser.sleep( 1000 );
    browser.actions().mouseMove(page.continueStep2Button).perform();
    page.continueStep2();
    browser.actions().mouseMove(page.monthlyPaymentLoanLengthToggles).perform();
    expect( page.monthlyPaymentLoanLengthToggles.isDisplayed() ).toBeFalsy();
    browser.actions().mouseMove(page.debtBurdenLoanLengthToggles).perform();
    expect( page.debtBurdenLoanLengthToggles.isDisplayed() ).toBeFalsy();
  } );

  it( 'should change one loan payment toggle if the other is changed', function() {
    page.setProgramLength( 6 );
    page.confirmVerification();
    browser.actions().mouseMove( page.subsidizedLoans ).perform();
    page.setSubsidizedLoans( 3500 );
    browser.actions().mouseMove( page.unsubsidizedLoans ).perform();
    page.setUnsubsidizedLoans( 6000 );
    browser.sleep( 1000 );
    page.continueStep2();
    page.toggleMonthlyPaymentLoanLengthTo25Yrs();
    browser.actions().mouseMove( page.debtBurdenLoan25YrsToggle ).perform();
    browser.sleep( 2000 );
    expect( page.debtBurdenLoan25YrsToggle.getAttribute( 'checked' ).length > 0 );
  } );

} );
