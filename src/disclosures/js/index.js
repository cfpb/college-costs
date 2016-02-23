'use strict';

var fetch = require( './dispatchers/get-api-values' );
var financialModel = require( './models/financial-model' );
var schoolModel = require( './models/school-model' );
var getModelValues = require( './dispatchers/get-model-values' );
var getSchoolValues = require( './dispatchers/get-school-values');
var getViewValues = require( './dispatchers/get-view-values');
var financialView = require( './views/financial-view' );
var metricView = require( './views/metric-view' );
var linksView = require( './views/links-view' );
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
      // Placeholder to set bar graphs
      metricView.init();
      // Check for URL offer data
      if ( getViewValues.urlOfferExists() ) {
        $.when( getViewValues.urlOfferHandler() )
          .done( function( offerValues ) {
            var values = {};
            publish.extendFinancialData( offerValues );
            values = getModelValues.financial();
            financialView.updateViewFromProgram( values );
            financialView.updateView( values );
          } );
      }
    } );
  }
};

$( document ).ready( function() {
  app.init();
} );
