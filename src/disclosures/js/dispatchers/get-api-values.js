'use strict';

var getApiValues = {

  values: {},


  constants: function() {
    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase +
      '/understanding-your-financial-aid-offer/api/constants/';
    var constantsRequest = $.ajax( {
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
    return constantsRequest;
  },

  expenses: function() {
    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase +
      '/understanding-your-financial-aid-offer/api/expenses/';
    var expensesRequest = $.ajax( {
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
    return expensesRequest;
  },

  fetchSchoolData: function( iped ) {
    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase +
      '/understanding-your-financial-aid-offer/api/school/' + iped + '/';
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
    if ( !pid ) {
      return [{
        'pidNotFound': 'An invalid program ID was passed to the ' +
        'fetchProgramData request.'
      }];
    } else {
      var urlBase = $( 'main' ).attr( 'data-context' );
      var url = '/' + urlBase +
        '/understanding-your-financial-aid-offer/api/program/' + iped + '_' +
        pid + '/';
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
    }
  },

  fetchNationalData: function( iped, pid ) {
    var urlBase = $( 'main' ).attr( 'data-context' ),
        url;
    if ( typeof pid !== 'undefined' ) {
      url = '/' + urlBase +
        '/understanding-your-financial-aid-offer/api/national-stats/' + iped +
        '_' + pid + '/';
    } else {
      url = '/' + urlBase +
        '/understanding-your-financial-aid-offer/api/national-stats/' + iped +
        '/';
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
    return $.when(
      this.fetchSchoolData( iped ),
      this.fetchProgramData( iped, pid ),
      this.fetchNationalData( iped, pid )
    );
  },

  initialData: function() {
    return $.when( this.constants(), this.expenses() );
  }

};

module.exports = getApiValues;
