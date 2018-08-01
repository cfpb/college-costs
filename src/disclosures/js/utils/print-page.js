// TODO: Remove jquery.
const $ = require( 'jquery' );

const Analytics = require( './Analytics' );
const getDataLayerOptions = Analytics.getDataLayerOptions;
require( '../libs/google-cloud-print' );

let ua = navigator.userAgent.toLowerCase(),
    isAndroid = ua.indexOf( 'android' ) > -1;

/**
 * Print the current screen using Google Cloud Print for Android devices.
 */
function printAndroidPage() {
  // https://developers.google.com/cloud-print/docs/gadget
  const gadget = new window.cloudprint.Gadget();
  gadget.setPrintDocument( 'text/html', $( 'title' ).html(),
    document.documentElement.innerHTML, 'utf-8' );
  gadget.openPrintDialog();
}

$( document ).ready( function() {
  $( '.next-steps_controls > .btn' ).on( 'click', function( evt ) {
    evt.preventDefault();
    if ( isAndroid ) {
      printAndroidPage();
    } else {
      window.print();
    }
    Analytics.sendEvent( getDataLayerOptions( 'Step Completed', 'Print' ) );
  } );
} );
