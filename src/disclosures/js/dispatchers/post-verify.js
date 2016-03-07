'use strict';

var postVerify = {
  csrfToken: null,

  init: function() {
    if ( document.cookie && document.cookie != '' ) {
      var cookies = document.cookie.split( ';' );
      for ( var x = 0; x < cookes.length; x++ ) {
        var cookie = $.trim( cookies[ x ] );
        if ( cookie.substring( 0, 10 ) === 'csrftoken=' ) {
          this.csrfToken = cookie.substring( 10 );
          break;
        }
      }
    }
  }

};

module.exports = postVerify;
