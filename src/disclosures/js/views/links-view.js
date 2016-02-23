'use strict';

var formatURL = require( '../utils/format-url' );
var constructScorecardSearch = require( '../utils/construct-scorecard-search' );

var linksView = {
  $schoolLinkText: $( '.school-link' ),
  $scorecardLink: $( '.scorecard-link' ),

  updateLinks: function( values ) {
    this.$schoolLinkText = $( '.school-link' );
    this.$scorecardLink = $( '.scorecard-link' );
    this.setSchoolLink( values );
    this.setScorecardSearch( values );
  },

  setSchoolLink: function( values ) {
    var schoolURL = formatURL( values.url );
    if ( schoolURL ) {
      var $schoolLink = $( '<a>', {
        'href': schoolURL,
        'target': '_blank',
        'class': this.$schoolLinkText.attr( 'class' )
      } )
        .text( this.$schoolLinkText.text() );
      this.$schoolLinkText.replaceWith( $schoolLink );
    }
  },

  setScorecardSearch: function( values ) {
    var pcip = '',
        zip = '',
        // We're using a 50-mile radius, the most common Scorecard search
        radius = '50',
        scorecardURL = this.$scorecardLink.attr( 'href' ),
        scorecardQuery;

    if ( values.hasOwnProperty( 'cipCode' ) ) {
      pcip = values.cipCode.slice( 0, 2 ); 
    }
    if ( values.hasOwnProperty( 'zip5' ) ) {
      zip = values.zip5; 
    }
    scorecardQuery = constructScorecardSearch( pcip, zip, radius );
    this.$scorecardLink.attr( 'href', scorecardURL + scorecardQuery );
  }

};

module.exports = linksView;
