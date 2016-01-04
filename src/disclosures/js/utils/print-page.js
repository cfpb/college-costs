'use strict';

/**
 * Print the current screen.
 * Uses Google Cloud Print for Android devices.
 */
function printPage() {
  var ua = navigator.userAgent.toLowerCase(),
 	    isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

  if (isAndroid) {
    // https://developers.google.com/cloud-print/docs/gadget
    var gadget = new cloudprint.Gadget();
    gadget.setPrintDocument("url", $('title').html(), window.location.href, "utf-8");
    gadget.openPrintDialog();
  } else {
    window.print();
  }

}

module.exports = printPage;
