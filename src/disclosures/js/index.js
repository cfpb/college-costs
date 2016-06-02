'use strict';

var fetch = require( './dispatchers/get-api-values' );
var verifyOffer = require( './dispatchers/post-verify' );
var financialModel = require( './models/financial-model' );
var schoolModel = require( './models/school-model' );
var expensesModel = require( './models/expenses-model' );
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
    $.when( fetch.initialData() )
      .done( function( constants, expenses ) {
        financialModel.init( constants[0] );
        financialView.init();
        expensesModel.init( expenses[0] );
        // Check for URL offer data
        if ( getUrlValues.urlOfferExists() ) {
          var urlValues = getUrlValues.urlValues();
          $.when( fetch.schoolData( urlValues.collegeID, urlValues.programID ) )
            .done( function( schoolData, programData, nationalData ) {
              var data = {},
                schoolValues;
              $.extend( data, schoolData[0], programData[0], nationalData[0] );
              schoolValues = schoolModel.init( data );
              expensesModel.resetCurrentValues(
                schoolValues.BLSAverage.substr( 0, 2 ),
                schoolValues.salary
              );
              financialModel.updateModelWithProgram( schoolValues );
              financialView.updateViewWithProgram( schoolValues );
              publish.extendFinancialData( urlValues );
              metricView.init();
              financialView.updateView( getModelValues.financial() );
            } );
        }
        questionView.init();
      } );
    verifyOffer.init();
  }
};

$( document ).ready( function() {
  app.init();
} );
