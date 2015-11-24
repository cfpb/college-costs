'use strict';

// var $ = require( 'jquery' ),
var FinancialModel = require( './lib/financial-data.js' ),
    financials = new FinancialModel(),
    View = require( './lib/school-view.js' ),
    schoolView = new View(),
    queryHandler = require( './lib/query-handler.js' );

require('./nemo');
require('./nemo-shim');


function init() {
  // Set the financials.values property with defaults
  financials.calc();
}

function randomFinancials() {
  $( '[data-financial]' ).each( function() {
    var val = Math.floor( Math.random() * 10000 );

    $( this ).val( val );
  });
}

function updateModelFromView() {
  var newValues = schoolView.getValues();
  $.extend( financials.values, newValues );
  financials.calc();
}

function updateViewFromModel() {
  schoolView.updateView( financials.values );
}

$( document ).ready( function() {
  init();

  $( '#calculate-debt' ).click( function() {
    updateModelFromView();
    updateViewFromModel();
  });

  $( '#add-random' ).click( function() {
    randomFinancials();
  });

  if ( location.search !== '' ) {
    var urlValues = queryHandler( location.search );
    $.extend( financials.values, urlValues );
    financials.calc();
    schoolView.updateView( financials.values );
  }


});
