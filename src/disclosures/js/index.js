'use strict';

var fetch = require( './dispatchers/get-api-values' );
var financialModel = require( './models/financial-model' );
var schoolModel = require( './models/school-model' );
var getSchoolValues = require( './dispatchers/get-school-values');
var financialView = require( './views/financial-view' );
var metricView = require( './views/metric-view' );
var linksView = require( './views/links-view' );


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
      metricView.demo();
      if ( financialView.urlOfferExists() ) {
        financialView.urlOfferHandler();
      }
    } );
  }
};

$( document ).ready( function() {
  app.init();
} );
