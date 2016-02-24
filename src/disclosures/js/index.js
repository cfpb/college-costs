'use strict';

var fetch = require( './dispatchers/get-api-values' );
var financialModel = require( './models/financial-model' );
var schoolModel = require( './models/school-model' );
var getModelValues = require( './dispatchers/get-model-values' );
var getUrlValues = require( './dispatchers/get-url-values' );
var financialView = require( './views/financial-view' );
var metricView = require( './views/metric-view' );
var questionView = require( './views/question-view' );
var publish = require( './dispatchers/publish-update' );


require( './utils/nemo' );
require( './utils/nemo-shim' );
require( './utils/print-page' );

var app = {
  init: function() {
  // jquery promise to delay full model creation until ajax resolves
    $.when( fetch.constants() ).done( function( resp ) {
      financialModel.init( resp );
      financialView.init();
      // Check for URL offer data
      if ( getUrlValues.urlOfferExists() ) {
        var urlValues = getUrlValues.urlValues();
        $.when( fetch.schoolData( urlValues.collegeID, urlValues.programID ) )
          .done( function( data ) {
            var schoolValues = schoolModel.init( data[0] );
            publish.extendFinancialData( $.extend( schoolValues, urlValues ) );
            financialView.updateViewFromProgram( schoolValues );
            metricView.init();
          } );
        // $.when( getUrlValues.urlOfferHandler() )
        //   .done( function( offerValues ) {
        //     var values = {};
        //     publish.extendFinancialData( offerValues );
        //     values = getModelValues.financial();
        //     financialView.updateViewFromProgram( values );
        //     financialView.updateView( values );
        //   } );
      }
      questionView.init();
      financialView.updateView( getModelValues.financial() );
    } );
  }
};

$( document ).ready( function() {
  app.init();
} );
