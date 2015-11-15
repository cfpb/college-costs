describe("CFPBComparisonTool.moneyToNum(), the text to number converter...", function() {
    it("should convert mixed alphanumeric to number by removing non-numeric characters", function() {
        var money = "test5";
        number = CFPBComparisonTool.moneyToNum(money);
        expect(number).toEqual(5);
        var money = "$55";
        number = CFPBComparisonTool.moneyToNum(money);
        expect(number).toEqual(55);
    });
    it("should convert 'negative' numbers to whole numbers**", function() {
        var money = "-55";
        number = CFPBComparisonTool.moneyToNum(money);
        expect(number).toEqual(55);
    });
    it("should convert strings with no numbers to 0", function() {
        var money = "this is a test";
        number = CFPBComparisonTool.moneyToNum(money);
        expect(number).toEqual(0);
    });
    it("should, when given an non-string parameter (or null), simply return 0", function() {
        var money = 9999;
        number = CFPBComparisonTool.moneyToNum(money);
        expect(number).toEqual(0);
        var money = {"test":1, "foo": "faa"};
        number = CFPBComparisonTool.moneyToNum(money);
        expect(number).toEqual(0);
        var money = null;
        number = CFPBComparisonTool.moneyToNum(money);
        expect(number).toEqual(0);
    });
});

describe("CFPBComparisonTool.numToMoney(), the number to text converter...", function() {
    it("should convert numbers to strings with a preceding dollar sign", function() {
        var num = 5;
        money = CFPBComparisonTool.numToMoney(num);
        expect(money).toEqual("$5");
    });
    it("should preserve negative numbers**", function() {
        var num = -5;
        money = CFPBComparisonTool.numToMoney(num);
        expect(money).toEqual("$-5");
    });
});

describe("findEmptyColumn should return the first empty column, returns column number (1-3)", function() {
    beforeEach(function() {
        setFixtures('<table><thead><tr id="institution-row" class="institution-row"><th scope="col" data-column="1" data-schoolid=""></th><th scope="col" data-column="2" data-schoolid=""></th><th scope="col" data-column="3" data-schoolid=""></th></tr></thead></table>');
    });

    it("should return 1 if the none of the columns have data in them", function() {
        var expected_col = 1;
        var actual_col = CFPBComparisonTool.findEmptyColumn();
        expect(actual_col).toEqual(expected_col);
    });

    it("should return 2 if the first column has data in it", function() {
        // arrange
        $("#institution-row [data-column='1']").attr("data-schoolid", "123");

        // action
        var actual_col = CFPBComparisonTool.findEmptyColumn();

        // assert
        expect(actual_col).toEqual(2);
    });

    it("should return undefined if all of the columns are filled with school IDs", function() {
        // arrange 
        $("#institution-row [data-column='1']").attr("data-schoolid", "123");
        $("#institution-row [data-column='2']").attr("data-schoolid", "456");
        $("#institution-row [data-column='3']").attr("data-schoolid", "789");

        // action
        var actual_col = CFPBComparisonTool.findEmptyColumn();

        // assert
        expect(actual_col).toEqual(false);
    });
});



/*describe("jQuery.fn.setbyname, which sets an element to a value using the 'name' attribute...", function() {
    beforeEach(function() {
        var fixture = '<table><tr><td data-column="1"><input type="text" data-nickname="foofaa" /></td>';
        fixture += '<td data-column="1"><h2 data-nickname="faafaa">Faafaa</h2></td>';
        fixture += '<td data-column="1"><input data-nickname="foofoo" class="interest-rate"></td></tr></table>'
        setFixtures(fixture);
    });
    it("should set an input element to a monetary string value using the 'data-nickname' attribute", function() {
        var column = new CFPBComparisonTool.Column(1);
        column.setByNickname('foofaa', 4000);
        expect($('input[data-nickname="foofaa"]').val()).toEqual("$4,000");
    });
    it("should set a non-input element to a monetary string value using the 'data-nickname' attribute", function() {
        var column = new CFPBComparisonTool.Column(1);
        column.setByNickname('faafaa', 3000);
        expect($('h2[data-nickname="faafaa"]').html()).toEqual("$3,000");
    });
    it("should set a input element with the .interest-rate class to a percentage if the 'p' parameter is present", function() {
        var column = new CFPBComparisonTool.Column(1);
        column.setByNickname('foofoo', .5, "p");
        expect($('input[data-nickname="foofoo"]').val()).toEqual("50%");
    });
});*/
