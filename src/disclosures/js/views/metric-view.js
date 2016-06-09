'use strict';

var getFinancial = require( '../dispatchers/get-financial-values' );
var getSchool = require( '../dispatchers/get-school-values' );
var formatUSD = require( 'format-usd' );

var metricView = {
  metrics: {
    debtBurden: {
      school: NaN,
      national: 0.08,
      low: 0.075,
      high: 0.085,
      better: 'lower'
    },
    gradRate: {
      school: NaN,
      national: NaN,
      nationalKey: 'completionRateMedian',
      better: 'higher',
      format: 'decimal-percent'
    },
    defaultRate: {
      school: NaN,
      national: NaN,
      nationalKey: 'defaultRate',
      better: 'lower',
      format: 'decimal-percent'
    }
  },

  settlementStatus: false,

  /**
   * Initiates the object
   */
  init: function() {
    this.settlementStatus =
      Boolean( getSchool.values().settlementSchool ) || false;
    this.setMetrics();
    this.updateGraphs();
    this.toggleListener();
    this.updateMonthlyPayment();
  },

  /**
   * Helper function which adds data to the metrics object for use by
   * graphs, etc.
   */
  setMetrics: function() {
    var graphKeys = [ 'gradRate', 'defaultRate' ],
        financials = getFinancial.values();
    for ( var x = 0; x < graphKeys.length; x++ ) {
      var key = graphKeys[x],
          nationalKey = metricView.metrics[key].nationalKey;
      metricView.metrics[key].school = financials[key];
      metricView.metrics[key].national = financials[nationalKey];
      metricView.metrics[key].min = financials[nationalKey + 'Low'];
      metricView.metrics[key].max = financials[nationalKey + 'High'];
    }
  },

  /**
   * Helper function that updates the value or text of an element
   * @param {object} $ele - jQuery object of the element to update
   * @param {number|string} value - The new value
   * @param {Boolean} format - Type of number, for formatting
   */
  updateText: function( $ele, value, format ) {
    if ( format === 'currency' ) {
      value = formatUSD( { amount: value, decimalPlaces: 0 } );
    }
    if ( format === 'decimal-percent' ) {
      value = Math.round( value * 100 ).toString() + '%';
    }
    $ele.text( value );
  },


  /**
   * Fixes overlapping points on a bar graph
   * @param {object} $graph jQuery object of the graph containing the points
   */
  fixOverlap: function( $graph ) {
    var $school = $graph.find( '[data-bar-graph_number="you"]' ),
        $national = $graph.find( '[data-bar-graph_number="average"]' ),
        metricKey = $graph.attr( 'data-metric' ),
        metrics = metricView.metrics[metricKey],
        schoolHeight = $school.find( '.bar-graph_label' ).height(),
        schoolTop = $school.position().top,
        nationalHeight = $national.find( '.bar-graph_label' ).height(),
        nationalTop = $national.position().top,
        $higherPoint = $national,
        $higherLabels,
        $lowerPoint = $school,
        // nationalPointHeight is the smaller and gives just the right offset
        offset = nationalHeight - Math.abs( schoolTop - nationalTop );

    // Check $higherPoint
    if ( schoolTop > nationalTop ) {
      $higherPoint = $school;
      $lowerPoint = $national;
    }
    $higherLabels = $higherPoint.find( '.bar-graph_label, .bar-graph_value' );

    // If the values are equal, handle the display with CSS only
    if ( metrics.school === metrics.national ) {
      $graph.addClass( 'bar-graph__equal' );
      return;
    }
    // If the points partially overlap, move the higher point's labels up
    if ( nationalTop <= schoolTop + schoolHeight &&
      nationalTop + nationalHeight >= schoolTop ) {
      $higherLabels.css( {
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
   * @param {string} schoolText Text of the graph's school point
   * @param {string} nationalText Text of the graph's school point
   */
  setGraphValues: function( $graph ) {
    var $school = $graph.find( '[data-bar-graph_number="you"]' ),
        $national = $graph.find( '[data-bar-graph_number="average"]' ),
        metricKey = $graph.attr( 'data-metric' ),
        metrics = metricView.metrics[metricKey];
    if ( isNaN( metrics.school ) ) {
      $graph.addClass( 'bar-graph__missing-you' );
    } else {
      this.updateText( $school, metrics.school, metrics.format );
    }
    if ( isNaN( metrics.national ) ) {
      $graph.addClass( 'bar-graph__missing-average' );
    } else {
      this.updateText( $national, metrics.national, metrics.format );
    }
  },

  /**
   * Sets the position of each point on a bar graph
   * @param {object} $graph jQuery object of the graph containing the points
   * @param {number|NaN} schoolValue Value reported by the school
   * @param {number|NaN} nationalValue Average national value
   * @param {object} $school jQuery object of the graph's school point
   * @param {object} $national jQuery object of the graph's national point
   */
  setGraphPositions: function( $graph ) {
    // schoolValue, nationalValue, $school, $national
    var graphHeight = $graph.height(),
        metricKey = $graph.attr( 'data-metric' ),
        nationalValue = metricView.metrics[metricKey].national,
        schoolValue = metricView.metrics[metricKey].school,
        min = $graph.attr( 'data-graph-min' ),
        max = $graph.attr( 'data-graph-max' ),
        $school = $graph.find( '.bar-graph_point__you' ),
        $national = $graph.find( 'bar-graph_point__average' ),
        bottoms = {},
        bottomOffset = 20;

    bottoms.school = ( graphHeight - bottomOffset ) / ( max - min ) *
      ( schoolValue - min ) + bottomOffset;
    bottoms.national = ( graphHeight - bottomOffset ) /
      ( max - min ) * ( nationalValue - min ) + bottomOffset;

    // A few outlier schools have very high average salaries, so we need to
    // prevent those values from falling off the top of the graph
    if ( schoolValue > max ) {
      bottoms.school = graphHeight;
      $graph.addClass( 'bar-graph__high-point' );
    }
    $school.css( 'bottom', bottoms.school );
    $national.css( 'bottom', bottoms.national );
  },

  /**
   * Classifies school value in relation to the national average
   * @param {number|NaN} metricKey - metric to be checked
   * @returns {string} Classes to add to the notification box
   */
  getNotifications: function( metricKey ) {
    var classes = 'cf-notification ',
        metrics = metricView.metrics[metricKey],
        schoolValue = metrics.school,
        nationalValue = metrics.national,
        min = metrics.min,
        max = metrics.max,
        belowMin = schoolValue < metrics.min,
        aboveMax = schoolValue > metrics.max,
        lowerIsBetter = metrics.better === 'lower',
        higherIsBetter = metrics.better === 'higher';
    if ( isNaN( schoolValue ) && isNaN( nationalValue ) ) {
      classes += 'metric_notification__no-data cf-notification__warning';
    } else if ( isNaN( schoolValue ) ) {
      classes += 'metric_notification__no-you cf-notification__warning';
    } else if ( isNaN( nationalValue ) ) {
      classes += 'metric_notification__no-average cf-notification__warning';
    } else if ( schoolValue >= min && schoolValue <= max ) {
      classes = 'metric_notification__same';
    } else if ( belowMin && lowerIsBetter || aboveMax && higherIsBetter ) {
      classes = 'metric_notification__better';
    } else if ( belowMin && higherIsBetter || aboveMax && lowerIsBetter ) {
      classes += 'metric_notification__worse cf-notification__error';
    } else if ( isNaN( min ) || isNaN( max ) ) {
      classes = '';
    }
    return classes;
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
  updateGraphs: function() {
    var $graphs = $( '.bar-graph' );
    $graphs.each( function() {
      var $graph = $( this ),
          metricKey = $graph.attr( 'data-metric' ),
          notificationClasses = metricView.getNotifications( metricKey ),
          $notification = $graph.siblings( '.metric_notification' );

      metricView.setGraphValues( $graph );
      metricView.setGraphPositions( $graph );
      metricView.fixOverlap( $graph );
      if ( this.settlementStatus === false ) {
        metricView.setNotificationClasses( $notification, notificationClasses );
      } else {
        $graph.find( '.bar-graph_point__average ' ).hide();
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
  updateDebtBurden: function() {
    var $section = $( '[data-repayment-section="debt-burden"]' ),
        $elements = $section.find( '[data-debt-burden]' ),
        term = $section.find( 'input:checked' ).val(),
        key = term + 'Year',
        financials = getFinancial.values(),
        values = financials[key],
        $notification = $( '.debt-burden .metric_notification' ),
        selecter;

    // Calculate values
    values.annualSalary = financials.medianSalary;
    values.monthlySalary = values.annualSalary / 12;
    values.debtBurden = values.loanMonthly / values.monthlySalary;

    // Update debt burden elements
    $elements.each( function() {
      var $ele = $( this ),
          prop = $ele.attr( 'data-debt-burden' ),
          format = 'currency';
      if ( prop === 'debtBurden' ) {
        format = 'decimal-percent';
      }
      metricView.updateText( $ele, values[prop], format );
    } );

    selecter = this.getNotifications( 'debtBurden' );

    if ( this.settlementStatus === false ) {
      this.setNotificationClasses( $notification, selecter );
    } else {
      this.hideNotificationClasses( $notification );
    }
  },

  updateMonthlyPayment: function() {
    var $section = $( '[data-repayment-section="monthly-payment"]' ),
        term = $section.find( 'input:checked' ).val(),
        key = term + 'Year',
        values = getFinancial.values()[key];
    $section.find( '[data-repayment]' ).each( function() {
      var prop = $( this ).attr( 'data-repayment' ),
          val = values[prop];
      val = formatUSD( { amount: val, decimalPlaces: 0 } );
      $( this ).text( val );
    } );
  },

  /**
   * Listener for clicks on the repayment toggles
   */
  toggleListener: function() {
    $( '[data-repayment-section] input' ).click( function() {
      var $ele = $( this ),
          $parent = $ele.closest( '[data-repayment-section' ),
          section = $parent.attr( 'data-repayment-section' ),
          term = $ele.val();
      if ( section === 'monthly-payment' ) {
        metricView.updateMonthlyPayment( term );
      }
      if ( section === 'estimated-debt-burden' ) {
        metricView.updateDebtBurden( term );
      }
    } );
  }

};

module.exports = metricView;
