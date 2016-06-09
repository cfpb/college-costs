var chai = require( 'chai' );
var expect = chai.expect;
var metricView = require( '../../src/disclosures/js/views/metric-view' );

describe( 'metric-view', function() {

  beforeEach( function() {
    metricView.metrics.test = {
      school: 'None',
      national: 0.5,
      min: 0.4,
      max: 0.6,
      better: 'higher'
    }
  } );

  it( 'gives the proper notification classes when no data is available', function() {
    metricView.metrics.test.school = 'None';
    metricView.metrics.test.national = undefined;
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__no-data cf-notification__warning'
      );
  });

  it( 'gives the proper notification classes when school data is missing', function() {
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__no-you cf-notification__warning'
    );
  });

  it( 'gives the proper notification classes when national data is missing', function() {
    metricView.metrics.test.national = undefined;
    metricView.metrics.test.school = 0.5;
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__no-average cf-notification__warning'
    );
  });

  it( 'gives the proper notification classes when the school value ' +
       'is near the national value', function() {
    metricView.metrics.test.school = 0.55;
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal( 'metric_notification__same' );
  });

  it( 'gives the proper notification classes when the school value ' +
       'is higher than the national value (and that\'s a good thing)', function() {
    metricView.metrics.test.school = 0.7;
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal( 'metric_notification__better' );
  });

  it( 'gives the proper notification classes when the school value ' +
       'is lower than the national value (and that\'s a good thing)', function() {
    metricView.metrics.test.school = 0.2;
    metricView.metrics.test.better = 'lower';
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal( 'metric_notification__better' );
  });

  it( 'gives the proper notification classes when the school value is ' +
       'higher than the national value (and that\'s a bad thing)', function() {
    metricView.metrics.test.school = 0.7;
    metricView.metrics.test.better = 'lower';
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__worse cf-notification__error'
      );
  });

  it( 'gives the proper notification classes when the school value is ' +
       'lower than the national value (and that\'s a bad thing)', function() {
    metricView.metrics.test.national = 0.5;
    metricView.metrics.test.school = 0.3;
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__worse cf-notification__error'
    );
  });

  it( 'gives the proper notification classes when min and max ' +
       'values are not numbers', function() {
    metricView.metrics.test.national = 0.5;
    metricView.metrics.test.school = 0.5;
    metricView.metrics.test.min = undefined;
    metricView.metrics.test.max = 'I like turtles';
    var notificationClasses = metricView.getNotifications( 'test' );
    expect( notificationClasses ).to.equal( '' );
  });

  it( 'calculates monthly salary', function() {
    var annualSalary = 34300,
        monthlySalary = metricView.calculateMonthlySalary( annualSalary );
    expect( monthlySalary.toFixed( 4 ) ).to.equal( '2858.3333' );
  });

  it( 'calculates debt burden', function() {
    var monthlyLoanPayment = 240,
        monthlySalary = 2858,
        debtBurden = metricView.calculateDebtBurden( monthlyLoanPayment, monthlySalary );
    expect( debtBurden.toFixed( 4 ) ).to.equal( '0.0840' );
  });

});
