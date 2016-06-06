'use strict';

var getFinancial = require( '../dispatchers/get-financial-values' );
var getSchool = require( '../dispatchers/get-school-values' );
var formatUSD = require( 'format-usd' );

var metricView = {

  /**
   * Initiates the object
   */
  init: function() {
    var values = getFinancial.values();
    var settlementStatus =
      Boolean( getSchool.values().settlementSchool ) || false;
    this.updateGraphs( values, settlementStatus );
    // updateDebtBurdenDisplay is called in financialView.updateView, not here,
    // since the debt burden needs to refresh when loan amounts are modified
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
  calculateBottoms:
  function( minValue, maxValue, graphHeight, schoolValue, nationalValue ) {
    var bottoms = {},
        // Lines fall off the bottom of the graph if they sit right at the base
        bottomOffset = 20;
    bottoms.school = ( graphHeight - bottomOffset ) / ( maxValue - minValue ) *
      ( schoolValue - minValue ) + bottomOffset;
    bottoms.national = ( graphHeight - bottomOffset ) /
      ( maxValue - minValue ) * ( nationalValue - minValue ) + bottomOffset;
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
      formattedValue = formatUSD( { amount: rawValue, decimalPlaces: 0 } );
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
  fixOverlap: function( $graph, schoolAverageFormatted,
    nationalAverageFormatted, $schoolPoint, $nationalPoint ) {
    var schoolPointHeight = $schoolPoint.find( '.bar-graph_label' ).height(),
        schoolPointTop = $schoolPoint.position().top,
        nationalPointHeight = $nationalPoint.find(
          '.bar-graph_label' ).height(),
        nationalPointTop = $nationalPoint.position().top,
        $higherPoint = schoolPointTop > nationalPointTop ?
        $nationalPoint : $schoolPoint,
        $higherPointLabels = $higherPoint.find(
          '.bar-graph_label, .bar-graph_value' ),
        $lowerPoint = schoolPointTop > nationalPointTop ?
        $schoolPoint : $nationalPoint,
        // nationalPointHeight is the smaller and gives just the right offset
        offset = nationalPointHeight -
        Math.abs( schoolPointTop - nationalPointTop );
    // If the values are equal, handle the display with CSS only
    if ( schoolAverageFormatted === nationalAverageFormatted ) {
      $graph.addClass( 'bar-graph__equal' );
      return;
    }
    // If the points partially overlap, move the higher point's labels up
    if ( nationalPointTop <= schoolPointTop + schoolPointHeight &&
      nationalPointTop + nationalPointHeight >= schoolPointTop ) {
      $higherPointLabels.css( {
        'padding-bottom': offset,
        'top': -offset
      } );
      // Need to reset the z-index since fixOverlap is called on page load and
      // again when a verification button is clicked
      $higherPoint.css( 'z-index', 'auto' );
      $lowerPoint.css( 'z-index', 'auto' );
      $lowerPoint.css( 'z-index', 100 );
    }
  },

  /**
   * Sets text of each point on a bar graph (or a class if a point is missing)
   * @param {object} $graph jQuery object of the graph containing the points
   * @param {string} schoolAverageFormatted Text of the graph's school point
   * @param {string} nationalAverageFormatted Text of the graph's school point
   */
  setGraphValues: function( $graph, schoolAverageFormatted,
    nationalAverageFormatted ) {
    var $schoolPointNumber =
    $graph.find( '.bar-graph_point__you .bar-graph_number' ),
        $nationalPointNumber =
        $graph.find( '.bar-graph_point__average .bar-graph_number' );
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
  setGraphPositions: function( $graph, schoolAverage, nationalAverage,
    $schoolPoint, $nationalPoint ) {
    var graphHeight = $graph.height(),
        minValue = $graph.attr( 'data-graph-min' ),
        maxValue = $graph.attr( 'data-graph-max' ),
        bottoms = this.calculateBottoms( minValue, maxValue, graphHeight,
          schoolAverage, nationalAverage );
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
  getNotificationClasses: function( schoolValue, nationalValue, sameMin,
    sameMax, betterDirection ) {
    var notificationClasses = '';
    if ( isNaN( schoolValue ) && isNaN( nationalValue ) ) {
      notificationClasses =
      'metric_notification__no-data cf-notification cf-notification__warning';
    } else if ( isNaN( schoolValue ) ) {
      notificationClasses =
      'metric_notification__no-you cf-notification cf-notification__warning';
    } else if ( isNaN( nationalValue ) ) {
      notificationClasses = 'metric_notification__no-average cf-notification cf-notification__warning';
    } else if ( schoolValue >= sameMin && schoolValue <= sameMax ) {
      notificationClasses = 'metric_notification__same';
    } else if ( schoolValue < sameMin && betterDirection === 'lower' ||
      schoolValue > sameMax && betterDirection === 'higher' ) {
      notificationClasses = 'metric_notification__better';
    } else if ( schoolValue < sameMin && betterDirection === 'higher' ||
      schoolValue > sameMax && betterDirection === 'lower' ) {
      notificationClasses =
      'metric_notification__worse cf-notification cf-notification__error';
    }
    return notificationClasses;
  },

  /**
   * Adds the correct classes to metric notification boxes
   * @param {object} $notification jQuery object of the notification box
   * @param {string} notificationClasses Classes to add to the notification
   */
  setNotificationClasses: function( $notification, notificationClasses ) {
    $notification
      .attr( 'class', 'metric_notification' )
      .addClass( notificationClasses );
  },

  /**
   * Hides the metric notification boxes for settlement schools
   * @param {object} $notification jQuery object of the notification box
   */
  hideNotificationClasses: function( $notification ) {
    $notification
      .attr( 'class', 'metric_notification' )
      .hide();
  },

  /**
   * Initializes all metrics with bar graphs
   * @param {object} values Financial model values
   * @param {boolean} settlementStatus Flag if this is a settlement school
   */
  updateGraphs: function( values, settlementStatus ) {
    var $graphs = $( '.bar-graph' );
    $graphs.each( function() {
      var $graph = $( this ),
          metricKey = $graph.attr( 'data-metric' ),
          nationalKey = $graph.attr( 'data-national-metric' ),
          graphFormat = $graph.attr( 'data-incoming-format' ),
          schoolAverage = parseFloat( values[metricKey] ),
          schoolAverageFormatted =
            metricView.formatValue( graphFormat, schoolAverage ),
          nationalAverage = parseFloat( values[nationalKey] ),
          nationalAverageFormatted =
            metricView.formatValue( graphFormat, nationalAverage ),
          $schoolPoint = $graph.find( '.bar-graph_point__you' ),
          $nationalPoint = $graph.find( '.bar-graph_point__average' ),
          $notification = $graph.siblings( '.metric_notification' ),
          sameMin = parseFloat( values[nationalKey + 'Low'] ),
          sameMax = parseFloat( values[nationalKey + 'High'] ),
          betterDirection = $notification.attr( 'data-better-direction' ),
          notificationClasses =
            metricView.getNotificationClasses( schoolAverage, nationalAverage,
            sameMin, sameMax, betterDirection );
      metricView.setGraphValues( $graph, schoolAverageFormatted,
        nationalAverageFormatted );
      metricView.setGraphPositions( $graph, schoolAverage, nationalAverage,
        $schoolPoint, $nationalPoint );
      metricView.fixOverlap( $graph, schoolAverageFormatted,
        nationalAverageFormatted, $schoolPoint, $nationalPoint );
      if ( settlementStatus === false ) {
        metricView.setNotificationClasses( $notification, notificationClasses );
      } else {
        $nationalPoint.hide();
        metricView.hideNotificationClasses( $notification );
      }
    } );
  },

  /**
   * Calculates the student's debt burden
   * @param {number} monthlyLoanPayment Student's monthly loan payment after
   * graduation
   * @param {monthlySalary} monthlySalary Student's estimated monthly salary
   * after graduation
   * @returns {number} Student's debt burden
   */
  calculateDebtBurden: function( monthlyLoanPayment, monthlySalary ) {
    var debtBurden = monthlyLoanPayment / monthlySalary;
    return debtBurden;
  },

  /**
   * Calculates a monthly salary from an annual salary
   * @param {number} annualSalary Annual salary
   * @returns {number} Monthly salary
   */
  calculateMonthlySalary: function( annualSalary ) {
    var monthlySalary = annualSalary / 12;
    return monthlySalary;
  },

  /**
   * Populates the debt burden numbers and shows the corresponding notification
   * on the page
   * @param {object} values Financial model values
   * @param {boolean} settlementStatus Flag if this is a settlement school
   */
  updateDebtBurdenDisplay: function( values, settlementStatus ) {
    var annualSalary = Number( values.medianSalary ) ||
      Number( values.earningsMedian ),
        monthlySalary = this.calculateMonthlySalary( annualSalary ),
        monthlyLoanPayment = values.loanMonthly || 0,
        debtBurden =
          this.calculateDebtBurden( monthlyLoanPayment, monthlySalary ),
        annualSalaryFormatted = this.formatValue( 'currency', annualSalary ),
        monthlySalaryFormatted = this.formatValue( 'currency', monthlySalary ),
        monthlyLoanPaymentFormatted =
          this.formatValue( 'currency', monthlyLoanPayment ),
        debtBurdenFormatted = this.formatValue( 'decimal-percent', debtBurden ),
        $annualSalaryElement = $( '[data-debt-burden="annual-salary"]' ),
        $monthlySalaryElement = $( '[data-debt-burden="monthly-salary"]' ),
        $monthlyPaymentElement = $( '[data-debt-burden="monthly-payment"]' ),
        $debtBurdenElement = $( '[data-debt-burden="debt-burden"]' ),
        $notification = $( '.debt-burden .metric_notification' ),
        // We're using 8% or below as the recommended debt burden
        debtBurdenLimit = 0.08,
        // Debt burdens that round to 8% are considered "the same as" the
        // recommendation
        debtBurdenLow = debtBurdenLimit - 0.005,
        debtBurdenHigh = debtBurdenLimit + 0.005,
        notificationClasses = this.getNotificationClasses( debtBurden,
          debtBurdenLimit, debtBurdenLow, debtBurdenHigh, 'lower' );
    $annualSalaryElement.text( annualSalaryFormatted );
    $monthlySalaryElement.text( monthlySalaryFormatted );
    $monthlyPaymentElement.text( monthlyLoanPaymentFormatted );
    $debtBurdenElement.text( debtBurdenFormatted );
    if ( settlementStatus === false ) {
      this.setNotificationClasses( $notification, notificationClasses );
    } else {
      this.hideNotificationClasses( $notification );
    }
  }

};

module.exports = metricView;
