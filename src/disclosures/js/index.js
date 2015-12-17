'use strict';

var financialModel = require( './models/financial-model' );
var financialView = require( './views/financial-view' );

require( './utils/nemo' );
require( './utils/nemo-shim' );

var app = {
  init: function() {
    financialModel.init();
    financialView.init();
  }
};


$( document ).ready( function() {
  app.init();
} );
