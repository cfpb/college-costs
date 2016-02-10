'use strict';

var schoolModel = require( '../models/school-model' );
var formatUSD = require( 'format-usd' );

var metricView = {

  init: function() {
    var $graphs = $( '.bar-graph' );
    $graphs.each( function() {
      var $graph = $( this ),
          metricKey = $graph.attr( 'data-metric' ),
          nationalKey = $graph.attr( 'data-national-metric' ),
          schoolValues = schoolModel.values,
          nationalValues = window.nationalData || {},
          schoolAverage = parseFloat( schoolValues[metricKey] ),
          nationalAverage = parseFloat( nationalValues[nationalKey] );
      metricView.setGraph( $graph, schoolAverage, nationalAverage );
    } );
  },

  calculateBottom: function( graphHeight, maxValue, minValue, bottomOffset, value ) {
    return ( ( ( graphHeight - bottomOffset ) / ( maxValue - minValue ) ) * ( value - minValue ) ) + bottomOffset;
  },

  formatValues: function( valueType, rawValue ) {
    var formattedValue = '';
    if ( valueType === 'decimal-percent' ) {
      formattedValue = Math.round( rawValue * 100 ).toString() + '%';
    }
    if ( valueType === 'currency' ) {
      formattedValue = formatUSD( rawValue, {decimalPlaces: 0} );
    }
    return formattedValue;
  },

  setGraph: function( $graph, schoolAverage, nationalAverage ) {
    var minValue = $graph.attr( 'data-graph-min' ),
        maxValue = $graph.attr( 'data-graph-max' ),
        graphHeight = $graph.height(),
        // Graph lines fall off the design if they sit right at the bottom of the graph
        bottomOffset = 20,
        graphFormat = $graph.attr( 'data-incoming-format' ),
        $schoolPoint = $graph.find( '.bar-graph_point__you' ),
        schoolPointBottom = this.calculateBottom( graphHeight, maxValue, minValue, bottomOffset, schoolAverage ),
        $schoolPointNumber = $schoolPoint.find( '.bar-graph_number' ),
        schoolAverageFormatted = this.formatValues( graphFormat, schoolAverage ),
        $nationalPoint = $graph.find( '.bar-graph_point__average' ),
        nationalPointBottom = this.calculateBottom( graphHeight, maxValue, minValue, bottomOffset, nationalAverage ),
        $nationalPointNumber = $nationalPoint.find( '.bar-graph_number' ),
        nationalAverageFormatted = this.formatValues( graphFormat, nationalAverage );
    $schoolPointNumber.text( schoolAverageFormatted );
    $nationalPointNumber.text( nationalAverageFormatted );
    $schoolPoint.css( 'bottom', schoolPointBottom );
    $nationalPoint.css( 'bottom', nationalPointBottom );
    // Set bottom offset
    // Set bottom positions
    // Stop lines from overlapping
    // Figure out what to do if lines are exactly the same
  }

};

module.exports = metricView;

/* To do
  - Handle missing data
  - Refactor to split setGraph into smaller pieces?
  - Refactor all graph vars into an object: getGraphVariables?
*/
