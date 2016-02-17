'use strict';

var schoolModel = require( '../models/school-model' );
var formatUSD = require( 'format-usd' );

var metricView = {

  /**
   * Initiates the object
   */
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
          nationalAverageFormatted = metricView.formatValue( graphFormat, nationalAverage ),
          $schoolPoint = $graph.find( '.bar-graph_point__you' ),
          $nationalPoint = $graph.find( '.bar-graph_point__average' );
      metricView.setGraphValues( $graph, schoolAverageFormatted, nationalAverageFormatted );
      metricView.setGraphPositions( $graph, schoolAverage, nationalAverage, $schoolPoint, $nationalPoint );
      metricView.fixOverlap( $graph, schoolAverageFormatted, nationalAverageFormatted, $schoolPoint, $nationalPoint );
    } );
  },

  /**
   * Calculates the CSS bottom positions of each point on a bar graph
   * @param {object} $graph jQuery object of the graph containing the points
   * @param {number} graphHeight Height of the graph
   * @param {number} schoolValue Value reported by the school
   * @param {number} nationalValue Average national value
   * @returns {object} Object with CSS bottom positions for each point
   */
  calculateBottoms: function( $graph, graphHeight, schoolValue, nationalValue ) {
    var minValue = $graph.attr( 'data-graph-min' ),
        maxValue = $graph.attr( 'data-graph-max' ),
        bottoms = {},
        // Lines fall off the bottom of the graph if they sit right at the base
        bottomOffset = 20;
    bottoms.school = ( graphHeight - bottomOffset ) / ( maxValue - minValue ) * ( schoolValue - minValue ) + bottomOffset;
    bottoms.national = ( graphHeight - bottomOffset ) / ( maxValue - minValue ) * ( nationalValue - minValue ) + bottomOffset;
    return bottoms;
  },

  /**
   * Fixes overlapping points on a bar graph
   * @param {object} $graph jQuery object of the graph containing the points
   * @param {string} schoolAverageFormatted Text of the graph's school point
   * @param {string} nationalAverageFormatted Text of the graph's school point
   * @param {object} $schoolPoint jQuery object of the graph's school point
   * @param {object} $nationalPoint jQuery object of the graph's national point
   */
  fixOverlap: function( $graph, schoolAverageFormatted, nationalAverageFormatted, $schoolPoint, $nationalPoint ) {
    var schoolPointHeight = $schoolPoint.find( '.bar-graph_label' ).height(),
        schoolPointTop = $schoolPoint.position().top,
        nationalPointHeight = $nationalPoint.find( '.bar-graph_label' ).height(),
        nationalPointTop = $nationalPoint.position().top,
        $higherPoint = schoolPointTop > nationalPointTop ? $nationalPoint : $schoolPoint,
        $higherPointLabels = $higherPoint.find( '.bar-graph_label, .bar-graph_value' ),
        $lowerPoint = schoolPointTop > nationalPointTop ? $schoolPoint : $nationalPoint,
        // nationalPointHeight is the smaller and gives just the right offset
        offset = nationalPointHeight - Math.abs( schoolPointTop - nationalPointTop );
    // If the values are equal, handle the display with CSS only
    if ( schoolAverageFormatted === nationalAverageFormatted ) {
      $graph.addClass( 'bar-graph__equal' );
      return;
    }
    // If the points partially overlap, move the higher point's labels up
    if ( nationalPointTop <= schoolPointTop + schoolPointHeight && nationalPointTop + nationalPointHeight >= schoolPointTop ) {
      $higherPointLabels.css( {
        'padding-bottom': offset,
        'top': -offset
      } );
      $lowerPoint.css( 'z-index', 100 );
    }
  },

  /**
   * Formats a raw number for display
   * @param {string} valueType Type of value to format (percent or currency)
   * @param {number|string} rawValue Value to format
   * @returns {boolean|string} False if rawValue is not a number, a formatted
   * string otherwise
   */
  formatValue: function( valueType, rawValue ) {
    var formattedValue = '';
    if ( isNaN( rawValue ) ) {
      return false;
    }
    if ( valueType === 'decimal-percent' ) {
      formattedValue = Math.round( rawValue * 100 ).toString() + '%';
    }
    if ( valueType === 'currency' ) {
      formattedValue = formatUSD( rawValue, { decimalPlaces: 0 } );
    }
    return formattedValue;
  },

  /**
   * Sets text of each point on a bar graph (or a class if a point is missing)
   * @param {object} $graph jQuery object of the graph containing the points
   * @param {string} schoolAverageFormatted Text of the graph's school point
   * @param {string} nationalAverageFormatted Text of the graph's school point
   */
  setGraphValues: function( $graph, schoolAverageFormatted, nationalAverageFormatted ) {
    var $schoolPointNumber = $graph.find( '.bar-graph_point__you .bar-graph_number' ),
        $nationalPointNumber = $graph.find( '.bar-graph_point__average .bar-graph_number' );
    if ( schoolAverageFormatted ) {
      $schoolPointNumber.text( schoolAverageFormatted );
    } else {
      $graph.addClass( 'bar-graph__missing-you' );
    }
    if ( nationalAverageFormatted ) {
      $nationalPointNumber.text( nationalAverageFormatted );
    } else {
      $graph.addClass( 'bar-graph__missing-average' );
    }
  },

  /**
   * Sets the position of each point on a bar graph
   * @param {object} $graph jQuery object of the graph containing the points
   * @param {number} schoolAverage Value reported by the school
   * @param {number} nationalAverage Average national value
   * @param {object} $schoolPoint jQuery object of the graph's school point
   * @param {object} $nationalPoint jQuery object of the graph's national point
   */
  setGraphPositions: function( $graph, schoolAverage, nationalAverage, $schoolPoint, $nationalPoint ) {
    var graphHeight = $graph.height(),
        bottoms = this.calculateBottoms( $graph, graphHeight, schoolAverage, nationalAverage );
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
