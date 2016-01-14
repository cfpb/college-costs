'use strict';

var metricView = {

  // Placeholder to set bar graphs
  demo: function() {
    $( '.graduation-rate .bar-graph_point__you' ).css( 'top', '5px' );
    $( '.graduation-rate .bar-graph_point__average' ).css( 'top', '30px' );
    $( '.average-salary .bar-graph_point__you' ).css( 'top', '80px' );
    $( '.average-salary .bar-graph_point__average' ).css( 'top', '40px' );
    $( '.loan-default-rates .bar-graph_point__you' ).css( 'top', '25px' );
    $( '.loan-default-rates .bar-graph_point__average' ).css( 'top', '70px' );
  }

};

module.exports = metricView;
