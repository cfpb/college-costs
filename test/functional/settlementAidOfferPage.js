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
    }},
    denyVerification: { value: function () {
        this.incorrectInfoButton.click();
    }}
});

module.exports = settlementAidOfferPage;
