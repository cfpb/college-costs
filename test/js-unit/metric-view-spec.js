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

});
