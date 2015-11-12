'use strict';

var calcDebt = require( 'student-debt-calc' ),
    $ = require( 'jquery' ),
    formatUSD = require( 'format-usd' ),
    stringToNum = require( './lib/handle-string-input.js'),
    financials = {};

function randomFinancials() {
  $( '[data-financial]' ).each( function() {
    var val = Math.floor( Math.random() * 10000 );

    $( this ).val( val );
  });
}

function getFinancials() {
  $( '[data-financial]' ).each( function() {
    var name = $( this ).attr('data-financial'),
        value = stringToNum( $( this ).val() );

    financials[ name ] = value;
  });
}

function setFinancials() {
  $( '[data-financial]' ).each( function() {
    var name = $( this ).attr('data-financial'),
        value = formatUSD( financials[ name ], { decimalPlaces: 0 } );

    if ( $( this ).prop( 'tagName' ) === 'INPUT' ) {
      $( this ).val( value );
    }
    else {
      $( this ).text( value );
    }
  });
}

$( document ).ready( function() {
  $( '#calculate-debt' ).click( function() {
    getFinancials();
    financials = calcDebt( financials );
    setFinancials();
  });

  $( '#add-random' ).click( function() {
    randomFinancials();
  });

});

