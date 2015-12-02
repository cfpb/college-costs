'use strict';

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

  // Demo code—remove this when the app is more fully functional!

  $( '#calculate-debt' ).click( function() {
    updateModelFromView();
    updateViewFromModel();
  });

  $( '#add-random' ).click( function() {
    randomFinancials();
  });

  $('#costs__tuition').val('10,000');
  $('#costs__room-and-board').val('5,000');
  $('#costs__books').val('500');
  $('#costs__transportation').val('500');
  $('#costs__other').val('0');
  $('[data-financial="costOfAttendance"]').text('16,000');
  $('#grants__pell').val('1,000');
  $('#grants__scholarships').val('3,000');
  $('[data-financial="totalGrantsScholarships"]').text('4,000');
  $('[data-financial="totalCost"]').text('12,000');

  // End demo code

  if ( location.search !== '' ) {
    var urlValues = queryHandler( location.search );
    $.extend( financials.values, urlValues );
    financials.calc();
    schoolView.updateView( financials.values );
  }


});
