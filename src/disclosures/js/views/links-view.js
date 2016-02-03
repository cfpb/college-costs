'use strict';

var formatURL = require( '../utils/format-url' );

var linksView = {
  $schoolLinkText: $( '.school-link' ),

  init: function() {
    this.setSchoolLink();
  },

  setSchoolLink: function() {
    var schoolURL = formatURL( window.schoolData.url );
    if ( schoolURL ) {
      var $schoolLink = $( '<a>', {
        'href': schoolURL,
        'target': '_blank',
        'class': this.$schoolLinkText.attr( 'class' )
      } )
        .text( this.$schoolLinkText.text() );
      this.$schoolLinkText.replaceWith( $schoolLink );
    }
  }

};

module.exports = linksView;
