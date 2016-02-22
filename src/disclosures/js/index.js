'use strict';

var fetch = require( './dispatchers/get-api-values' );
var financialModel = require( './models/financial-model' );
var schoolModel = require( './models/school-model' );
var financialView = require( './views/financial-view' );
var metricView = require( './views/metric-view' );
var questionView = require( './views/question-view' );
var linksView = require( './views/links-view' );

require( './utils/nemo' );
require( './utils/nemo-shim' );
require( './utils/print-page' );

var app = {
  init: function() {
  // jquery promise to delay full model creation until ajax resolves
    $.when( fetch.constants() ).done( function( resp ) {
      schoolModel.init();
      financialModel.init( resp );
      financialView.init();
      // Placeholder to set bar graphs
      metricView.demo();
      questionView.init();
      linksView.init();
    } );
  }
};

$( document ).ready( function() {
  app.init();
} );
