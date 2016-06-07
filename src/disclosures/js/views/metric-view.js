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
    this.toggleListener();
    this.updateMonthlyPayment();
    // updateDebtBurdenDisplay is called in financialView.updateView, not here,
    // since the debt burden needs to refresh when loan amounts are modified
  },

  /**
   * Calculates the CSS bottom positions of each point on a bar graph
   * @param {number} min Bottom point of a graph
   * @param {number} max Top point of a graph
   * @param {number} height Height of the graph
   * @param {number|NaN} schoolValue Value reported by the school
   * @param {number|NaN} nationalValue Average national value
   * @returns {object} Object with CSS bottom positions for each point
   */
  calculateBottoms: function( min, max, height, schoolValue, nationalValue ) {
    var bottoms = {},
        // Lines fall off the bottom of the graph if they sit right at the base
        bottomOffset = 20;
    bottoms.school = ( height - bottomOffset ) / ( max - min ) *
      ( schoolValue - min ) + bottomOffset;
    bottoms.national = ( height - bottomOffset ) /
      ( max - min ) * ( nationalValue - min ) + bottomOffset;
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
   * Helper function that updates the value or text of an element
   * @param {object} $ele - jQuery object of the element to update
   * @param {number|string} value - The new value
   * @param {Boolean} type - Type of number, for formatting
   */
  updateText: function( $ele, value, type ) {
    if ( type === 'currency' ) {
      value = formatUSD( { amount: value, decimalPlaces: 0 } );
    }
    if ( type === 'decimal-percent' ) {
      value = Math.round( value * 100 ).toString() + '%';
    }
    $ele.text( value );
  },


  /**
   * Fixes overlapping points on a bar graph
   * @param {object} $graph jQuery object of the graph containing the points
   * @param {string} schoolText Text of the graph's school point
   * @param {string} nationalText Text of the graph's school point
   * @param {object} $school jQuery object of the graph's school point
   * @param {object} $national jQuery object of the graph's national point
   */
  fixOverlap: function( $graph, schoolText, nationalText, $school, $national ) {
    var schoolPointHeight = $school.find( '.bar-graph_label' ).height(),
        schoolPointTop = $school.position().top,
        nationalPointHeight = $national.find(
          '.bar-graph_label' ).height(),
        nationalPointTop = $national.position().top,
        $higherPoint = schoolPointTop > nationalPointTop ?
        $national : $school,
        $higherPointLabels = $higherPoint.find(
          '.bar-graph_label, .bar-graph_value' ),
        $lowerPoint = schoolPointTop > nationalPointTop ?
        $school : $national,
        // nationalPointHeight is the smaller and gives just the right offset
        offset = nationalPointHeight -
        Math.abs( schoolPointTop - nationalPointTop );
    // If the values are equal, handle the display with CSS only
    if ( schoolText === nationalText ) {
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
   * @param {string} schoolText Text of the graph's school point
   * @param {string} nationalText Text of the graph's school point
   */
  setGraphValues: function( $graph, schoolText, nationalText ) {
    var $schoolPointNumber =
    $graph.find( '.bar-graph_point__you .bar-graph_number' ),
        $nationalPointNumber =
        $graph.find( '.bar-graph_point__average .bar-graph_number' );
    if ( schoolText ) {
      $schoolPointNumber.text( schoolText );
    } else {
      $graph.addClass( 'bar-graph__missing-you' );
    }
    if ( nationalText ) {
      $nationalPointNumber.text( nationalText );
    } else {
      $graph.addClass( 'bar-graph__missing-average' );
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
  setGraphPositions: function( $graph, schoolValue, nationalValue, $school, $national ) {
    var graphHeight = $graph.height(),
        minValue = $graph.attr( 'data-graph-min' ),
        maxValue = $graph.attr( 'data-graph-max' ),
        bottoms = this.calculateBottoms( minValue, maxValue, graphHeight,
          schoolValue, nationalValue );
    // A few outlier schools have very high average salaries, so we need to
    // prevent those values from falling off the top of the graph
    if ( schoolValue > maxValue ) {
      bottoms.school = graphHeight;
      $graph.addClass( 'bar-graph__high-point' );
    }
    $school.css( 'bottom', bottoms.school );
    $national.css( 'bottom', bottoms.national );
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
  updateDebtBurden: function() {
    // var annualSalary = Number( values.medianSalary ) ||
    //   Number( values.earningsMedian ),
    //     monthlySalary = this.calculateMonthlySalary( annualSalary ),
    //     monthlyLoanPayment = values.loanMonthly || 0,
    //     debtBurden =
    //       this.calculateDebtBurden( monthlyLoanPayment, monthlySalary ),
    //     annualSalaryFormatted = this.formatValue( 'currency', annualSalary ),
    //     monthlySalaryFormatted = this.formatValue( 'currency', monthlySalary ),
    //     monthlyLoanPaymentFormatted =
    //       this.formatValue( 'currency', monthlyLoanPayment ),
    //     debtBurdenFormatted = this.formatValue( 'decimal-percent', debtBurden ),
    //     $annualSalaryElement = $( '[data-debt-burden="annual-salary"]' ),
    //     $monthlySalaryElement = $( '[data-debt-burden="monthly-salary"]' ),
    //     $monthlyPaymentElement = $( '[data-debt-burden="monthly-payment"]' ),
    //     $debtBurdenElement = $( '[data-debt-burden="debt-burden"]' ),
    //     $notification = $( '.debt-burden .metric_notification' ),
    //     // We're using 8% or below as the recommended debt burden
    //     debtBurdenLimit = 0.08,
    //     // Debt burdens that round to 8% are considered "the same as" the
    //     // recommendation
    //     debtBurdenLow = debtBurdenLimit - 0.005,
    //     debtBurdenHigh = debtBurdenLimit + 0.005,
    //     notificationClasses = this.getNotificationClasses( debtBurden,
    //       debtBurdenLimit, debtBurdenLow, debtBurdenHigh, 'lower' );
    // $annualSalaryElement.text( annualSalaryFormatted );
    // $monthlySalaryElement.text( monthlySalaryFormatted );
    // $monthlyPaymentElement.text( monthlyLoanPaymentFormatted );
    // $debtBurdenElement.text( debtBurdenFormatted );

    var $section = $( '[data-repayment-section="debt-burden"]' ),
        $elements = $section.find( '[data-debt-burden]' ),
        term = $section.find( 'input:checked' ).val(),
        key = term + 'Year',
        financials = getFinancial.values(),
        values = financials[key],
        $notification = $( '.debt-burden .metric_notification' ),
        debtBurdenLimit = 0.08,
        debtBurdenLow = debtBurdenLimit - 0.005,
        debtBurdenHigh = debtBurdenLimit + 0.005
        notificationClasses;

    // Calculate values
    values.annualSalary = financials.medianSalary;
    values.monthlySalary = values.annualSalary / 12;
    values.debtBurden = values.loanMonthly / values.monthlySalary;

    // Update debt burden elements
    $elements.each( function() {
      var $ele = $( this ),
          prop = $ele.attr( 'data-debt-burden' ),
          type = 'currency';
      if ( prop === 'debtBurden' ) {
        type = 'decimal-percent';
      }
      metricView.updateText( $ele, values[prop], type );
    } );

    // if ( settlementStatus === false ) {
    //   this.setNotificationClasses( $notification, notificationClasses );
    // } else {
    //   this.hideNotificationClasses( $notification );
    // }
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
