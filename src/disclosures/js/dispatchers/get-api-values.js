'use strict';

var getApiValues = {

  values: {},


  constants: function() {
    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase + '/understanding-your-financial-aid-offer/api/constants/';
    var constantRequest = $.ajax( {
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      // TODO: the user should be notified of errors
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    } );

    return constantRequest;
  },

  fetchSchoolData: function( iped ) {
    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase + '/understanding-your-financial-aid-offer/api/school/' + iped + '.json';
    var schoolDataRequest = $.ajax( {
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      // TODO: the user should be notified of errors
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    } );

    return schoolDataRequest;
  },

  fetchProgramData: function( iped, pid ) {
    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase + '/understanding-your-financial-aid-offer/api/program/' + iped + '_' + pid + '/';
    var programDataRequest = $.ajax( {
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      // TODO: the user should be notified of errors
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    } );

    return programDataRequest;
  },

  fetchNationalData: function( iped, pid ) {
    var urlBase = $( 'main' ).attr( 'data-context' );
    if ( typeof pid !== undefined ) {
      var url = '/' + urlBase + '/understanding-your-financial-aid-offer/api/national-stats/' + iped + '_' + pid + '/';
    } else {
      var url = '/' + urlBase + '/understanding-your-financial-aid-offer/api/national-stats/' + iped + '/';
    }
    var nationalDataRequest = $.ajax( {
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      // TODO: the user should be notified of errors
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    } );

    return nationalDataRequest;
  },

  schoolData: function( iped, pid ) {
    return $.when( this.fetchSchoolData( iped ), this.fetchProgramData( iped, pid ), this.fetchNationalData( iped, pid ) )
      .done( function( schoolData, programData, nationalData ) {
        return $.extend( schoolData[0], programData[0], nationalData[0] );
      } );
  }

};

module.exports = getApiValues;
