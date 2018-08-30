'use strict';

var SettlementPage = require( './settlementAidOfferPage.js' );

fdescribe( 'The "Was this tool helpful?" section', function() {
  var page;
  var EC = protractor.ExpectedConditions;

  beforeEach(function() {
    page = new SettlementPage();
  } );

  it( 'should contain a link to the feedback form', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionYes();
    browser.sleep( 1000 );
    browser.wait( EC.visibilityOf( page.feedbackLink ), 8000 ); 
    expect( page.feedbackLink.getAttribute( 'href' ) ).toMatch( /\/paying-for-college2\/understanding-your-financial-aid-offer\/feedback$/ );
  } );

  it( 'should open the feedback form in a new tab', function() {
    page.confirmVerification();
    browser.sleep( 1000 );
    page.continueStep2();
    browser.sleep( 1000 );
    page.answerBigQuestionYes();
    browser.sleep( 1000 );
    page.followFeedbackLink();
    browser.sleep( 1000 );
    browser.getAllWindowHandles()
      .then( function ( handles ) {
        expect( handles.length ).toBe( 2 );
        browser.switchTo().window( handles[1] )
          .then( function () {
            browser.wait( EC.visibilityOf( $( '.pfc-feedback > #id_message' ) ), 8000 )
          } )
          .then( function () {
            browser.close();
            browser.sleep( 1000 );
            browser.switchTo().window( handles[0] );
          } );;
      } );
  } );

} );
