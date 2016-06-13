var chai = require( 'chai' );
var expect = chai.expect;
var view = require( '../../src/disclosures/js/views/metric-view' );

describe( 'metric-view', function() {

  beforeEach( function() {
    view.metrics.defaultRate = {
      school: 0.45,
      national: 0.5,
      low: 0.4,
      high: 0.6,
      better: 'higher'
    }
  } );

  it( 'sets standing=same if school is about the same', function() {
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    expect( view.metrics.defaultRate.standing ).to.equal( 'same' );
  });

  it( 'sets standing=better if school is higher and higher is better', function() {
    view.metrics.defaultRate.school = 0.75;
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    expect( view.metrics.defaultRate.standing ).to.equal( 'better' );
  });

  it( 'sets standing=worse if school is lower and higher is better', function() {
    view.metrics.defaultRate.school = 0.15;
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    expect( view.metrics.defaultRate.standing ).to.equal( 'worse' );
  });

  it( 'sets standing=better if school is lower and lower is better', function() {
    view.metrics.defaultRate.school = 0.15;
    view.metrics.defaultRate.better = 'lower';
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    expect( view.metrics.defaultRate.standing ).to.equal( 'better' );
  });

  it( 'sets standing=worse if school is higher and lower is better', function() {
    view.metrics.defaultRate.school = 0.75;
    view.metrics.defaultRate.better = 'lower';
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    expect( view.metrics.defaultRate.standing ).to.equal( 'worse' );
  });

  it( 'gives the proper notification classes when no data is available', function() {
    view.metrics.defaultRate.school = 'None';
    view.metrics.defaultRate.national = undefined;
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__no-data cf-notification__warning'
      );
  });

  it( 'gives the proper notification classes when school data is missing', function() {
    view.metrics.defaultRate.school = 'None';
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__no-you cf-notification__warning'
    );
  });

  it( 'gives the proper notification classes when national data is missing', function() {
    view.metrics.defaultRate.national = undefined;
    view.metrics.defaultRate.school = 0.5;
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__no-average cf-notification__warning'
    );
  });

  it( 'gives the proper notification classes when the school value ' +
       'is near the national value', function() {
    view.metrics.defaultRate.school = 0.55;
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal( 'metric_notification__same' );
  });

  it( 'gives the proper notification classes when the school value ' +
       'is higher than the national value (and that\'s a good thing)', function() {
    view.metrics.defaultRate.school = 0.7;
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal( 'metric_notification__better' );
  });

  it( 'gives the proper notification classes when the school value ' +
       'is lower than the national value (and that\'s a good thing)', function() {
    view.metrics.defaultRate.school = 0.2;
    view.metrics.defaultRate.better = 'lower';
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal( 'metric_notification__better' );
  });

  it( 'gives the proper notification classes when the school value is ' +
       'higher than the national value (and that\'s a bad thing)', function() {
    view.metrics.defaultRate.school = 0.7;
    view.metrics.defaultRate.better = 'lower';
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__worse cf-notification__error'
      );
  });

  it( 'gives the proper notification classes when the school value is ' +
       'lower than the national value (and that\'s a bad thing)', function() {
    view.metrics.defaultRate.national = 0.5;
    view.metrics.defaultRate.school = 0.3;
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal(
      'cf-notification metric_notification__worse cf-notification__error'
    );
  });

  it( 'gives the proper notification classes when low and high ' +
       'values are not numbers', function() {
    view.metrics.defaultRate.national = 0.5;
    view.metrics.defaultRate.school = 0.5;
    view.metrics.defaultRate.low = undefined;
    view.metrics.defaultRate.high = 'I like turtles';
    view.metrics.defaultRate =
      view.checkMetrics( view.metrics.defaultRate );
    var notificationClasses = view.getNotifications( 'defaultRate' );
    expect( notificationClasses ).to.equal( '' );
  });

  it( 'calculates monthly salary', function() {
    var annualSalary = 34300,
        monthlySalary = view.calculateMonthlySalary( annualSalary );
    expect( monthlySalary.toFixed( 4 ) ).to.equal( '2858.3333' );
  });

  it( 'calculates debt burden', function() {
    var monthlyLoanPayment = 240,
        monthlySalary = 2858,
        debtBurden = view.calculateDebtBurden( monthlyLoanPayment, monthlySalary );
    expect( debtBurden.toFixed( 4 ) ).to.equal( '0.0840' );
  });

});
