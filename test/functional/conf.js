exports.config = {
	framework: 'jasmine2',
  	seleniumAddress: 'http://localhost:4444/wd/hub',
 	capabilities: { 'browserName': 'chrome' },
 	specs: ['dd-functional-settlement-spec.js'], 

 	onPrepare:function(){
 		browser.ignoreSynchronization = true;
 	}
}