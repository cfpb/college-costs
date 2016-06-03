'use strict';

var formatURL = require( '../utils/format-url' );
var constructScorecardSearch = require( '../utils/construct-scorecard-search' );

var linksView = {
  $gradLinkText: $( '.graduation-link' ),
  $defaultLinkText: $( '.loan-default-link' ),
  $schoolLinkText: $( '.school-link' ),
  $scorecardLink: $( '.scorecard-link' ),

  /**
   * Initializes (and updates) links in Step 3 to the school's webiste and to
   * a College Scorecard search of related schools
   * @param {object} values Financial model values
   */
  updateLinks: function( values ) {
    this.$gradLinkText = $( '.graduation-link' );
    this.$defaultLinkText = $( '.loan-default-link' );
    this.$schoolLinkText = $( '.school-link' );
    this.$scorecardLink = $( '.scorecard-link' );
    this.setGraduationLink( values );
    this.setLoanDefaultLink( values );
    this.setSchoolLink( values );
    this.setScorecardSearch( values );
  },

  /**
   * Creates a link in Step 2 to the school's graduation metrics
   * on the College Scorecard website
   * @param {object} values Financial model values
   */
  setGraduationLink: function( values ) {
    var formattedSchoolName = values.school.replace( /\s/g, '-' );
    var gradURL = 'https://collegescorecard.ed.gov/school/?' + values.schoolID +
     '-' + formattedSchoolName + '#graduation';
    if ( gradURL ) {
      var $gradLink = $( '<a>', {
        'href': gradURL,
        'target': '_blank',
        'class': this.$gradLinkText.attr( 'class' )
      } )
        .text( this.$gradLinkText.text() );
      this.$gradLinkText.replaceWith( $gradLink );
    }
  },

  /**
   * Creates a link in Step 2 to the school's loan default metrics
   * @param {object} values Financial model values
   */
  setLoanDefaultLink: function( values ) {
    var defaultURL = 'http://nces.ed.gov/collegenavigator/?id=' +
      values.schoolID + '#fedloans';
    if ( defaultURL ) {
      var $defaultLink = $( '<a>', {
        'href': defaultURL,
        'target': '_blank',
        'class': this.$defaultLinkText.attr( 'class' )
      } )
        .text( this.$defaultLinkText.text() );
      this.$defaultLinkText.replaceWith( $defaultLink );
    }
  },

  /**
   * Creates a link in Step 3 to the school's website if the school has provided
   * a URL in the College Scorecard data
   * @param {object} values Financial model values
   */
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

  /**
   * Modifies the College Scorecard link in step 3 to search for schools that
   * offer a given program near a given ZIP if program and ZIP are specified
   * @param {object} values Financial model values
   */
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
