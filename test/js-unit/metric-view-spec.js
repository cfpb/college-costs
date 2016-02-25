var chai = require( 'chai' );
var expect = chai.expect;
var metricView = require( '../../src/disclosures/js/views/metric-view' );

describe( 'metric-view', function() {

  it( 'calculates graph point bottom positions for percent data', function() {
    var minValue = 0,
        maxValue = 1,
        graphHeight = 130,
        schoolValue = 0.55,
        nationalValue = 0.137,
        bottoms = metricView.calculateBottoms( minValue, maxValue, graphHeight, schoolValue, nationalValue );
    expect( bottoms.school ).to.equal( 80.5 );
    expect( bottoms.national ).to.equal( 35.07 );
  });

  it( 'calculates graph point bottom positions for salary data', function() {
    var minValue = 0,
        maxValue = 100000,
        graphHeight = 130,
        schoolValue = 23000,
        nationalValue = 31080,
        bottoms = metricView.calculateBottoms( minValue, maxValue, graphHeight, schoolValue, nationalValue );
    expect( bottoms.school ).to.equal( 45.3 );
    expect( bottoms.national ).to.equal( 54.188 );
  });

  it( 'formats percents', function() {
    var valueType = 'decimal-percent',
        rawValue = 0.137,
        formattedValue = metricView.formatValue( valueType, rawValue );
    expect( formattedValue ).to.equal( '14%' );
  });

  it( 'formats currencies', function() {
    var valueType = 'currency',
        rawValue = 31080,
        formattedValue = metricView.formatValue( valueType, rawValue );
    expect( formattedValue ).to.equal( '$31,080' );
  });

  it( 'does not try to format values that cannot be parsed into numbers', function() {
    var valueType = 'decimal-percent',
        rawValues = {
          'string': 'None',
          'empty': '',
          'space': ' ',
          'null': null,
          'undefined': undefined
        },
        formattedValues = {};
    for ( var valueType in rawValues ) {
      var rawValue = rawValues[valueType],
          parsedValue = parseFloat( rawValue );
      formattedValues[valueType] = metricView.formatValue( valueType, parsedValue )
    }
    expect( formattedValues['string'] ).to.equal( false );
    expect( formattedValues['empty'] ).to.equal( false );
    expect( formattedValues['space'] ).to.equal( false );
    expect( formattedValues['null'] ).to.equal( false );
    expect( formattedValues['undefined'] ).to.equal( false );
  });

  it( 'gives the proper notification classes when no data is available', function() {
    var schoolValue = parseFloat( 'None' ),
        nationalValue = parseFloat( undefined ),
        sameMin = 0.4,
        sameMax = 0.6,
        betterDirection = 'higher',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( 'metric_notification__no-data cf-notification cf-notification__warning' );
  });

  it( 'gives the proper notification classes when school data is missing', function() {
    var schoolValue = parseFloat( 'None' ),
        nationalValue = parseFloat( 0.5 ),
        sameMin = 0.4,
        sameMax = 0.6,
        betterDirection = 'higher',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( 'metric_notification__no-you cf-notification cf-notification__warning' );
  });

  it( 'gives the proper notification classes when national data is missing', function() {
    var schoolValue = parseFloat( 0.5 ),
        nationalValue = parseFloat( undefined ),
        sameMin = 0.4,
        sameMax = 0.6,
        betterDirection = 'higher',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( 'metric_notification__no-average cf-notification cf-notification__warning' );
  });

  it( 'gives the proper notification classes when the school value is near the national value', function() {
    var schoolValue = parseFloat( 0.55 ),
        nationalValue = parseFloat( 0.5 ),
        sameMin = 0.4,
        sameMax = 0.6,
        betterDirection = 'higher',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( 'metric_notification__same' );
  });

  it( 'gives the proper notification classes when the school value is higher than the national value (and that\'s a good thing)', function() {
    var schoolValue = parseFloat( 0.7 ),
        nationalValue = parseFloat( 0.5 ),
        sameMin = 0.4,
        sameMax = 0.6,
        betterDirection = 'higher',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( 'metric_notification__better' );
  });

  it( 'gives the proper notification classes when the school value is lower than the national value (and that\'s a good thing)', function() {
    var schoolValue = parseFloat( 0.3 ),
        nationalValue = parseFloat( 0.5 ),
        sameMin = 0.4,
        sameMax = 0.6,
        betterDirection = 'lower',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( 'metric_notification__better' );
  });

  it( 'gives the proper notification classes when the school value is higher than the national value (and that\'s a bad thing)', function() {
    var schoolValue = parseFloat( 0.7 ),
        nationalValue = parseFloat( 0.5 ),
        sameMin = 0.4,
        sameMax = 0.6,
        betterDirection = 'lower',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( 'metric_notification__worse cf-notification cf-notification__error' );
  });

  it( 'gives the proper notification classes when the school value is lower than the national value (and that\'s a bad thing)', function() {
    var schoolValue = parseFloat( 0.3 ),
        nationalValue = parseFloat( 0.5 ),
        sameMin = 0.4,
        sameMax = 0.6,
        betterDirection = 'higher',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( 'metric_notification__worse cf-notification cf-notification__error' );
  });

  it( 'gives the proper notification classes when sameMin and sameMax values are not numbers', function() {
    var schoolValue = parseFloat( 0.3 ),
        nationalValue = parseFloat( 0.5 ),
        sameMin = parseFloat( '' ),
        sameMax = parseFloat( '' ),
        betterDirection = 'higher',
        notificationClasses = metricView.getNotificationClasses( schoolValue, nationalValue, sameMin, sameMax, betterDirection );
    expect( notificationClasses ).to.equal( '' );
  });

});
