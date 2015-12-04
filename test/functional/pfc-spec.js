
describe("Financial aid offers for settlement students", function() {

	beforeEach(function() {
     	browser.get('http://localhost:8000/paying-for-college/demo/'); 
  });
	it('navigate to the page', function(){
		expect(browser.getTitle()).toBe('Just a demo! > Consumer Financial Protection Bureau');
	});

	it('should click on something', function(){
       var verify = element(by.css('.verify'));
       expect(verify.getText()).toBeDefined();

	})
	
});