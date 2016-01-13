'use strict';

var getApiValues = {

  values: {},

  constants: function() {
    var url = '../understanding-your-financial-aid-offer/api/constants/';
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
  }

};

module.exports = getApiValues;
