'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

describe( 'A dynamic financial aid disclosure that\'s required by settlement', function() {
	var page;
	var EC = protractor.ExpectedConditions;

	beforeEach(function() {
		page = new SettlementPage();
	} );

	// TODO - Change this title when we move from demo mode.
	it( 'should provide a student with the right page', function() {
		expect( browser.getTitle() ).toBe( 'Just a demo! > Consumer Financial Protection Bureau' );
	} );

	it( 'should contain an offer ID', function(){
		expect( browser.getCurrentUrl() ).toContain( 'oid' );
	} );

	// TODO - Add expectation that other sections are invisible
	it( 'should display the verify offer area first and no other sections', function() {
		browser.wait( EC.visibilityOf(page.verifySection ), 8000 );
	} );

	// TODO - Add expectation that verification buttons disappear, and all fields that should be prepopulated actually are, and that Step 3 is still hidden
	it( 'should let a student verify their information and go on to Step 1 and Step 2 of the offer', function() {
		page.confirmVerification();
		browser.wait( EC.visibilityOf(page.reviewSection ), 8000 );
		browser.wait( EC.visibilityOf(page.evaluateSection ), 8000 );
	} );

	// TODO - Add expectation that verification buttons disappear, offer ssections are not visible, that next steps for incorrect info are displayed, and that the trigger to notify the school is activated
	it( 'should let a student report incorrect aid offer information', function() {
		page.denyVerification();
	} );

	// *** Step 1: Review your offer ***

	// TODO - Uncomment remaining cost when it's hooked up
	it( 'should properly update when the tuition is modified', function() {
		page.confirmVerification();
		page.setTuitionFeesCosts( 3500 );
		expect(page.totalCostOfAttendance.getText()).toEqual( '3500' );
		expect(page.studentTotalCost.getText()).toEqual( '3500' );
		//expect(page.remainingCost.getText()).toEqual( '3500' );
	} );

	// TODO - Uncomment remaining cost when it's hooked up
	it( 'should properly update when the housing and meals are modified', function() {
		page.confirmVerification();
		page.setTuitionFeesCosts( 3500 );
		page.setHousingMealsCosts( 1500 );
		expect(page.totalCostOfAttendance.getText()).toEqual( '5000' );
		expect(page.studentTotalCost.getText()).toEqual( '5000' );
		//expect(page.addUpRemainingCost()).toEqual(page.remainingCost.getText());
	} );

	// TODO - Uncomment remaining cost when it's hooked up
	it( 'should properly update when the transportation is modified', function() {
		page.confirmVerification();
		page.setTuitionFeesCosts( 3500 );
		page.setHousingMealsCosts( 1500 );
		page.setTransportationCosts( 500 );
		expect(page.totalCostOfAttendance.getText()).toEqual( '5500' );
		expect(page.studentTotalCost.getText()).toEqual( '5500' );
		//expect(page.addUpRemainingCost()).toEqual(page.remainingCost.getText());
	} );

	// TODO - Uncomment remaining cost when it's hooked up
	it( 'should properly update when the books and supplies are modified', function() {
		page.confirmVerification();
		page.setTuitionFeesCosts( 3500 );
		page.setHousingMealsCosts( 1500 );
		page.setTransportationCosts( 500 );
		page.setBooksSuppliesCosts( 500 );
		expect(page.totalCostOfAttendance.getText()).toEqual( '6000' );
		expect(page.studentTotalCost.getText()).toEqual( '6000' );
		//expect(page.addUpRemainingCost()).toEqual(page.remainingCost.getText());
	} );

	// TODO - Uncomment remaining cost when it's hooked up
	it( 'should properly update when the other education costs are modified', function() {
		page.confirmVerification();
		page.setTuitionFeesCosts( 3500 );
		page.setHousingMealsCosts( 1500 );
		page.setOtherEducationCosts( 250 );
		expect(page.totalCostOfAttendance.getText()).toEqual( '5250' );
		expect(page.studentTotalCost.getText()).toEqual( '5250' );
		//expect(page.addUpRemainingCost()).toEqual(page.remainingCost.getText());
	} );

	// TODO - Uncomment remaining cost when it's hooked up
	it( 'should properly update when the Federal Pell Grants are modified within the limits', function() {
		page.confirmVerification();
		page.setTuitionFeesCosts( 15000 );
		page.setFederalPellGrants( 5000 );
		expect(page.totalGrantsScholarships.getText()).toEqual( '5000' );
		expect(page.studentTotalCost.getText()).toEqual( '10000' );
		//expect(page.addUpRemainingCost()).toEqual(page.remainingCost.getText());
	} );

});
