'use strict';
var financialView = require( '../views/financial-view' );

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
        console.log( 'API: constants', status, err );
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
        console.log( 'API: expenses', status, err );
      }
    } );
    return expensesRequest;
  },

  fetchSchoolData: function( iped ) {
    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase +
              '/understanding-your-financial-aid-offer/api/school/' +
              iped + '/';
    var schoolDataRequest = $.ajax( {
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      error: function( req, status, err ) {
        financialView.missingData( 'school' );
      }
    } );

    return schoolDataRequest;
  },

  fetchProgramData: function( iped, pid ) {
    if ( !pid ) {
      return [ {
        pidNotFound: 'An invalid program ID was passed to the ' +
        'fetchProgramData request.'
      } ];
    }

    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase +
              '/understanding-your-financial-aid-offer/api/program/' +
              iped + '_' + pid + '/';
    var programDataRequest = $.ajax( {
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      error: function( req, status, err ) {
        financialView.missingData( 'program' );
      }
    } );

    return programDataRequest;
  },

  fetchNationalData: function( iped, pid ) {
    var urlBase = $( 'main' ).attr( 'data-context' );
    var url = '/' + urlBase +
              '/understanding-your-financial-aid-offer/api/national-stats/' +
              iped;

    if ( typeof pid === 'undefined' ) {
      url += '/';
    } else {
      url += '_' + pid + '/';
    }

    var nationalDataRequest = $.ajax( {
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      // TODO: the user should be notified of errors
      error: function( req, status, err ) {
        console.log( 'API: fetchNationalData', status, err );
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
    // If there's a [data-warning], display error
    var warning = $( '[data-warning]' ).attr( 'data-warning' ),
        warningType,
        checks = [ 'school', 'program', 'offer' ];
    for ( var x = 0; x < checks.length; x++ ) {
      if ( warning.indexOf( checks[x] ) !== -1 ) {
        warningType = checks[x];
        financialView.missingData( warningType );
        return $.Deferred;
      }
    }
    return $.when( this.constants(), this.expenses() );
  }

};

module.exports = getApiValues;
