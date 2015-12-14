describe("A settlement student with a financial aid offer", function() {
	var EC = protractor.ExpectedConditions;

	// TODO: We will need to add offer variables to the end of the following URL.
	beforeEach(function() {
		browser.get('http://localhost:8000/paying-for-college/demo/'); 
  	});

	it('should be provided with the correct page', function(){
		expect(browser.getTitle()).toBe('Just a demo! > Consumer Financial Protection Bureau');
	});

	describe("should be able to access the URL", function() {

		it('and view the verify offer area', function(){
			var verify = element(by.id('verify'));
			EC.visibilityOf(verify);
		});
		
	});

	describe("should be able to report incorrect aid offer information", function() {

		it('and see information about contacting the school', function(){
		 	var wrongInfo = element(by.id('verify-wrong-info-btn'));
	    	wrongInfo.click();
	    	EC.visibilityOf(element(by.id('contact-your-school')));
		});

		it('and have the school be contacted', function(){
	    	element(by.id('verify-wrong-info-btn')).click();
		});
		
	});
	
});

