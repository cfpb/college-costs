exports.config = {
	framework: 'jasmine2',
  	seleniumAddress: 'http://localhost:4444/wd/hub',
 	capabilities: { 'browserName': 'chrome' },
 	specs: ['dd-functional-settlement-spec.js', 'dd-feedback-spec.js', 'dd-school-data-spec.js'],

 	onPrepare:function(){
 		browser.ignoreSynchronization = true;
 	}
}
