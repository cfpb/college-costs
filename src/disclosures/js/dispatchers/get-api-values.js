'use strict';

var getApiValues = {

  values: {},


  constants: function() {
    var url_base = $('main').attr('data-context');
    var url = '/' + url_base + '/understanding-your-financial-aid-offer/api/constants/';
    var constantRequest = $.ajax({
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      // TODO: the user should be notified of errors
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    });

    return constantRequest;
  },

  schoolData: function( id ) {
    var url_base = $('main').attr('data-context');
    var url = '/' + url_base + '/understanding-your-financial-aid-offer/api/school/' + id + '.json';
    var schoolDataRequest = $.ajax({
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      // TODO: the user should be notified of errors
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    });

    return schoolDataRequest;
  },

  programData: function( id ) {
    var url_base = $('main').attr('data-context');
    var url = '/' + url_base + '/understanding-your-financial-aid-offer/api/program/' + id + '/';
    var programDataRequest = $.ajax({
      url: url,
      dataType: 'json',
      success: function( resp ) {
        return resp;
      },
      // TODO: the user should be notified of errors
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    });

    return programDataRequest;
  }
};

module.exports = getApiValues;
