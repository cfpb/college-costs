'use strict';

var androidPrint = require( '../libs/google-cloud-print' );
var ua = navigator.userAgent.toLowerCase(),
    isAndroid = ua.indexOf( 'android' ) > -1;

/**
 * Print the current screen using Google Cloud Print for Android devices.
 */
function printAndroidPage() {
  // https://developers.google.com/cloud-print/docs/gadget
  var gadget = new androidPrint.cloudprint.Gadget();
  gadget.setPrintDocument( 'url', $( 'title' ).html(), window.location.href,
    'utf-8' );
  gadget.openPrintDialog();
}

$( document ).ready( function() {
  $( '.next-steps_controls > .btn' ).on( 'click', function( e ) {
    e.preventDefault();
    if ( isAndroid ) {
      printAndroidPage();
    } else {
      window.print();
    }
  } );
} );
