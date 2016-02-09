'use strict';

var formatURL = require( '../utils/format-url' );
var constructScorecardSearch = require( '../utils/construct-scorecard-search' );

var linksView = {
  $schoolLinkText: $( '.school-link' ),
  $scorecardLink: $( '.scorecard-link' ),

  init: function() {
    this.setSchoolLink();
    this.setScorecardSearch();
  },

  setSchoolLink: function() {
    if ( window.hasOwnProperty( 'schoolData' ) ) {
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
  },

  setScorecardSearch: function() {
    if ( window.hasOwnProperty( 'programData' ) ) {
      var pcip = window.programData.cipCode ? window.programData.cipCode.slice( 0, 2 ) : '',
          zip = window.schoolData.zip5 || '',
          // We're using a 50-mile radius, the most common Scorecard search
          radius = '50',
          scorecardURL = this.$scorecardLink.attr( 'href' ),
          scorecardQuery = constructScorecardSearch( pcip, zip, radius );
      this.$scorecardLink.attr( 'href', scorecardURL + scorecardQuery );      
    }
  },

  setScorecardSearch: function() {
    var pcip = window.programData.cipCode ? window.programData.cipCode.slice( 0, 2 ) : '',
        zip = window.schoolData.zip5 || '',
        // We're using a 50-mile radius, the most common Scorecard search
        radius = '50',
        scorecardURL = this.$scorecardLink.attr( 'href' ),
        scorecardQuery = constructScorecardSearch( pcip, zip, radius );
    this.$scorecardLink.attr( 'href', scorecardURL + scorecardQuery );
  }

};

module.exports = linksView;
