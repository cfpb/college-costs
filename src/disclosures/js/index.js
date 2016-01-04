'use strict';

var financialModel = require( './models/financial-model' );
var financialView = require( './views/financial-view' );
var metricView = require( './views/metric-view' );

require( './utils/nemo' );
require( './utils/nemo-shim' );
require( './utils/print-page' );

var app = {
  init: function() {
    financialModel.init();
    financialView.init();
    // Placeholder to set bar graphs
    metricView.demo();
  }
};

$( document ).ready( function() {
  app.init();

  $('.next-steps_controls.btn').click(function(e) {
    e.preventDefault();
    printPage();
    return false;
  });
} );
