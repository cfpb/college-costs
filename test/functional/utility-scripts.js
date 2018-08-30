'use strict';

var valueKeys = {
  remainingCostFinal: 'gap',
  totalCostOfAttendance: 'costOfAttendance',
  studentTotalCost: 'firstYearNetCost',
  tuitionFeesCosts: 'tuitionFees',
  housingMealsCosts: 'roomBoard',
  booksSuppliesCosts: 'books',
  transportationCosts: 'transportation',
  otherEducationCosts: 'otherExpenses',
  federalPellGrants: 'pell',
  directLoanOriginationFee: 'DLOriginationFee',
  totalProgramDebt: 'totalProgramDebt',
  totalRepayment: 'loanLifetime',
  totalMonthlyLeftOver: 'monthlyLeftover',
  monthlyRent: '',
  schoolSalaryValue: 'schoolSalary',
  schoolDebtAtRepaymentValue: 'totalDebt',
  debtBurdenPayment: 'loanMonthly',
  debtBurdenSalary: 'monthlySalary',
  averageMonthlySalary: 'monthlySalary'
}

function getFinancial( prop ) {
  var script = "$( '#main' ).attr( 'data-test', window.getFinancial.values()." +
                prop + " );";
  browser.executeScript( script );
  return $( '#main' ).getAttribute( 'data-test' ).then( function( attr) {
    return attr;
  } );
}

function getExpense( prop ) {
  var script = "$( '#main' ).attr( 'data-test', window.getExpenses.values()." +
                prop + " );";
  browser.executeScript( script );
  return $( '#main' ).getAttribute( 'data-test' ).then( function( attr) {
    return attr;
  } );
}

function cleanNumber( string ) {
  var sign = 1;
  var num = string.replace( /[^0-9\.]+/g, '' );

  if ( string.indexOf( '-' ) > -1 ) {
    num = '-' + num;
  }

  return num;
}

function waitForCostOfAttendance( page ) {
  return browser.wait( function() {
        return page.totalCostOfAttendance.getText().then(
          function( text ) {
            return text !== 'Updating...' && text !== '0';
          } );
      } )  
}

function waitForRemainingCost( page ) {
  return browser.wait( function() {
        return page.remainingCostFinal.getText().then(
          function( text ) {
            return text !== 'Updating...' && text !== '0';
          } );
      } )  
}

function waitForNumbers( page ) {
  return browser.wait( function() {
        return page.remainingCostFinal.getText().then(
          function( text ) {
            return text !== 'Updating...' && text !== '0';
          } );
      } )
}

function waitForExpenses( page ) {
  return browser.wait( function() {
        return page.totalMonthlyLeftOver.getText().then(
          function( text ) {
            return text !== 'Updating...' && text !== '0';
          } );
      } )
}

function checkFinancialValue( page, key, expectedValue ) {
  page[key].getAttribute( 'value' ).then( function( attr ) {
    attr = cleanNumber( attr );
    if ( typeof expectedValue === 'undefined' ) {
      expect( getFinancial( valueKeys[key] ) ).toEqual( attr );
    } else {
      expect( attr ).toEqual( expectedValue );
    }
  } );
}

function checkFinancialText( page, key, expectedValue ) {
  page[key].getText().then( function( attr ) {
    attr = cleanNumber( attr );
    if ( typeof expectedValue === 'undefined' ) {
      expect( getFinancial( valueKeys[key] ) ).toEqual( attr );
    } else {
      expect( attr ).toEqual( expectedValue );
    }
  } );
}

function checkExpenseValue( page, key, expectedValue ) {
  page[key].getAttribute( 'value' ).then( function( attr ) {
    attr = cleanNumber( attr );
    if ( typeof expectedValue === 'undefined' ) {
      expect( getExpense( valueKeys[key] ) ).toEqual( attr );
    } else {
      expect( attr ).toEqual( expectedValue );
    }
  } );
}

function checkExpenseText( page, key, expectedValue ) {
  page[key].getText().then( function( attr ) {
    attr = cleanNumber( attr );
    if ( typeof expectedValue === 'undefined' ) {
      expect( getExpense( valueKeys[key] ) ).toEqual( attr );
    } else {
      expect( attr ).toEqual( expectedValue );
    }
  } );
}

module.exports = {
  getFinancial: getFinancial,
  getExpense: getExpense,
  cleanNumber: cleanNumber,
  waitForCostOfAttendance: waitForCostOfAttendance,
  waitForRemainingCost: waitForRemainingCost,
  waitForNumbers: waitForNumbers,
  waitForExpenses: waitForExpenses,
  checkFinancialText: checkFinancialText,
  checkFinancialValue: checkFinancialValue,
  checkExpenseText: checkExpenseText,
  checkExpenseValue: checkExpenseValue
}