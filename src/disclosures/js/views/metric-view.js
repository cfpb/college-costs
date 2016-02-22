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
    this.initGraphs( $graphs, schoolValues, nationalValues );
  },

  /**
   * Calculates the CSS bottom positions of each point on a bar graph
   * @param {number} minValue Bottom point of a graph
   * @param {number} maxValue Top point of a graph
   * @param {number} graphHeight Height of the graph
   * @param {number|NaN} schoolValue Value reported by the school
   * @param {number|NaN} nationalValue Average national value
   * @returns {object} Object with CSS bottom positions for each point
   */
  calculateBottoms: function( minValue, maxValue, graphHeight, schoolValue, nationalValue ) {
    var bottoms = {},
        // Lines fall off the bottom of the graph if they sit right at the base
        bottomOffset = 20;
    bottoms.school = ( graphHeight - bottomOffset ) / ( maxValue - minValue ) * ( schoolValue - minValue ) + bottomOffset;
    bottoms.national = ( graphHeight - bottomOffset ) / ( maxValue - minValue ) * ( nationalValue - minValue ) + bottomOffset;
    return bottoms;
  },

  /**
   * Formats a raw number for display
   * @param {string} valueType Type of value to format (percent or currency)
   * @param {number|NaN} rawValue Value to format
   * @returns {boolean|string} False if rawValue is not a number, a formatted
   * string otherwise
   */
  formatValue: function( valueType, rawValue ) {
    var formattedValue = rawValue;
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
   * @param {number|NaN} schoolAverage Value reported by the school
   * @param {number|NaN} nationalAverage Average national value
   * @param {object} $schoolPoint jQuery object of the graph's school point
   * @param {object} $nationalPoint jQuery object of the graph's national point
   */
  setGraphPositions: function( $graph, schoolAverage, nationalAverage, $schoolPoint, $nationalPoint ) {
    var graphHeight = $graph.height(),
        minValue = $graph.attr( 'data-graph-min' ),
        maxValue = $graph.attr( 'data-graph-max' ),
        bottoms = this.calculateBottoms( minValue, maxValue, graphHeight, schoolAverage, nationalAverage );
    // A few outlier schools have very high average salaries, so we need to
    // prevent those values from falling off the top of the graph
    if ( schoolAverage > maxValue ) {
      bottoms.school = graphHeight;
      $graph.addClass( 'bar-graph__high-point' );
    }
    $schoolPoint.css( 'bottom', bottoms.school );
    $nationalPoint.css( 'bottom', bottoms.national );
  },

  /**
   * Classifies school value in relation to the national average
   * @param {number|NaN} schoolValue Value reported by the school
   * @param {number|NaN} nationalValue Average national value
   * @param {number} sameMin Lowest value considered "about the same" as the
   * national average (from College Scorecard)
   * @param {number} sameMax Highest value considered "about the same" as the
   * national average (from College Scorecard)
   * @param {string} betterDirection 'higher' or 'lower' depending on whether a
   * school value higher or lower than the national average is more desirable
   * @returns {string} Classes to add to the notification box
   */
  getNotificationClasses: function( schoolValue, nationalValue, sameMin, sameMax, betterDirection ) {
    var notificationClasses = '';
    if ( isNaN( schoolValue ) && isNaN( nationalValue ) ) {
      notificationClasses = 'metric_notification__no-data cf-notification cf-notification__warning';
    } else if ( isNaN( schoolValue ) ) {
      notificationClasses = 'metric_notification__no-you cf-notification cf-notification__warning';
    } else if ( isNaN( nationalValue ) ) {
      notificationClasses = 'metric_notification__no-average cf-notification cf-notification__warning';
    } else if ( schoolValue >= sameMin && schoolValue <= sameMax ) {
      notificationClasses = 'metric_notification__same';
    } else if ( schoolValue < sameMin && betterDirection === 'lower' || schoolValue > sameMax && betterDirection === 'higher' ) {
      notificationClasses = 'metric_notification__better';
    } else if ( schoolValue < sameMin && betterDirection === 'higher' || schoolValue > sameMax && betterDirection === 'lower' ) {
      notificationClasses = 'metric_notification__worse cf-notification cf-notification__error';
    }
    return notificationClasses;
  },

  /**
   * Adds the correct classes to metric notification boxes
   * @param {object} $notification jQuery object of the notification box
   * @param {string} notificationClasses Classes to add to the notification
   */
  setNotificationClasses: function( $notification, notificationClasses ) {
    $notification.addClass( notificationClasses );
  },

  /**
   * Initializes all metrics with bar graphs
   * @param {object} $graphs jQuery object of all graphs on the page
   * @param {object} schoolValues Values reported by the school
   * @param {object} nationalValues National average values
   */
  initGraphs: function( $graphs, schoolValues, nationalValues ) {
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
          $nationalPoint = $graph.find( '.bar-graph_point__average' ),
          $notification = $graph.siblings( '.metric_notification' ),
          sameMin = parseFloat( nationalValues[nationalKey + 'Low'] ),
          sameMax = parseFloat( nationalValues[nationalKey + 'High'] ),
          betterDirection = $notification.attr( 'data-better-direction' ),
          notificationClasses = metricView.getNotificationClasses( schoolAverage, nationalAverage, sameMin, sameMax, betterDirection );
      metricView.setGraphValues( $graph, schoolAverageFormatted, nationalAverageFormatted );
      metricView.setGraphPositions( $graph, schoolAverage, nationalAverage, $schoolPoint, $nationalPoint );
      metricView.fixOverlap( $graph, schoolAverageFormatted, nationalAverageFormatted, $schoolPoint, $nationalPoint );
      metricView.setNotificationClasses( $notification, notificationClasses );
    } );
  }

};

module.exports = metricView;
