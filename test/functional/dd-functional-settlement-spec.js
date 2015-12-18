'use strict';

var SettlementPage = require('../settlementAidOfferPage.js');

describe('A settlement aid offer page', function () {
	var page;
	var EC = protractor.ExpectedConditions;

	beforeEach(function () {
		page = new SettlementPage();
	});

	it('should provide a student with the right page', function(){
		expect(browser.getTitle()).toBe('Just a demo! > Consumer Financial Protection Bureau');
	});

	it('should contain an offer ID', function(){
		expect(browser.getCurrentUrl()).toContain('oid');
	});

	// TODO - Add expectation that other sections are invisible
	it('should display the verify offer area first and no other sections', function(){			
		expect(EC.visibilityOf(page.verifySection));
	});

	// TODO - Add expectation that verification buttons disappear and that Step 3 is hidden
	it("should let a student verify their information and go on to Step 1 and Step 2 of the offer", function() {
		page.confirmVerification();
		expect(EC.visibilityOf(page.reviewSection));
		expect(EC.visibilityOf(page.evaluateSection));
	});

	// TODO - Add expectation that verification buttons disappear, offer ssections are not visible, and that next steps for incorrect info are displayed
	it("should let a student report incorrect aid offer information", function() {
		page.denyVerification();
	});
	
});

