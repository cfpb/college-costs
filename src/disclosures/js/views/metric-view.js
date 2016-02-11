'use strict';

var schoolModel = require( '../models/school-model' );
var formatUSD = require( 'format-usd' );

var metricView = {

  init: function() {
    var $graphs = $( '.bar-graph' ),
        schoolValues = schoolModel.values,
        nationalValues = window.nationalData || {};
    $graphs.each( function() {
      var $graph = $( this ),
          metricKey = $graph.attr( 'data-metric' ),
          nationalKey = $graph.attr( 'data-national-metric' ),
          graphFormat = $graph.attr( 'data-incoming-format' ),
          schoolAverage = parseFloat( schoolValues[metricKey] ),
          schoolAverageFormatted = metricView.formatValue( graphFormat, schoolAverage ),
          nationalAverage = parseFloat( nationalValues[nationalKey] ),
          nationalAverageFormatted = metricView.formatValue( graphFormat, nationalAverage );
      metricView.setGraphValues( $graph, schoolAverageFormatted, nationalAverageFormatted );
      metricView.setGraphPositions( $graph, schoolAverage, nationalAverage );
    } );
  },

  calculateBottoms: function( $graph, graphHeight, schoolValue, nationalValue, $schoolPoint, $nationalPoint ) {
    var minValue = $graph.attr( 'data-graph-min' ),
        maxValue = $graph.attr( 'data-graph-max' ),
        bottoms = {},
        // Lines fall off the bottom of the graph if they sit right at the base
        bottomOffset = 20,
        schoolPointHeight = $schoolPoint.find( '.bar-graph_label' ).height(),
        nationalPointHeight = $nationalPoint.find( '.bar-graph_label' ).height();
    bottoms.school = ( graphHeight - bottomOffset ) / ( maxValue - minValue ) * ( schoolValue - minValue ) + bottomOffset;
    bottoms.national = ( graphHeight - bottomOffset ) / ( maxValue - minValue ) * ( nationalValue - minValue ) + bottomOffset;
    // If the national point overlaps the school point, move the higher point up
    // out of the way. The national point is never so high that moving the
    // school point above it will push the school point off the graph, so no
    // need to worry about that case.
    if ( bottoms.national <= bottoms.school + schoolPointHeight && bottoms.national + nationalPointHeight >= bottoms.school ) {
      if ( bottoms.school > bottoms.national ) {
        bottoms.school = bottoms.national + nationalPointHeight;
      } else {
        bottoms.national = bottoms.school + schoolPointHeight;
      }
    }
    return bottoms;
  },

  formatValue: function( valueType, rawValue ) {
    var formattedValue = '';
    if ( valueType === 'decimal-percent' ) {
      formattedValue = Math.round( rawValue * 100 ).toString() + '%';
    }
    if ( valueType === 'currency' ) {
      formattedValue = formatUSD( rawValue, { decimalPlaces: 0 } );
    }
    return formattedValue;
  },

  setGraphValues: function( $graph, schoolAverageFormatted, nationalAverageFormatted ) {
    var $schoolPointNumber = $graph.find( '.bar-graph_point__you .bar-graph_number' ),
        $nationalPointNumber = $graph.find( '.bar-graph_point__average .bar-graph_number' );
    $schoolPointNumber.text( schoolAverageFormatted );
    $nationalPointNumber.text( nationalAverageFormatted );
    if ( schoolAverageFormatted === nationalAverageFormatted ) {
      $graph.addClass( 'bar-graph__equal' );
    }
  },

  setGraphPositions: function( $graph, schoolAverage, nationalAverage ) {
    var graphHeight = $graph.height(),
        $schoolPoint = $graph.find( '.bar-graph_point__you' ),
        $nationalPoint = $graph.find( '.bar-graph_point__average' ),
        bottoms = this.calculateBottoms( $graph, graphHeight, schoolAverage, nationalAverage, $schoolPoint, $nationalPoint );
    // A few outlier schools have very high average salaries, so we need to
    // prevent those values from falling off the top of the graph
    if ( bottoms.school > graphHeight ) {
      bottoms.school = graphHeight;
    }
    $schoolPoint.css( 'bottom', bottoms.school );
    $nationalPoint.css( 'bottom', bottoms.national );
  }

};

module.exports = metricView;

/* To do
  - Handle identical values (i.e. fully overlapping points): hide the national average line and value, add a class to the graph that pushes the school label up
  - Handle missing data
  - metricView.setAlert (call right after setGraph in init)
  - Handle no JS?
  - Refactor all graph vars into an object: getGraphVariables?
  - iped=239169 has crazy high salary and no grad rate!
*/
