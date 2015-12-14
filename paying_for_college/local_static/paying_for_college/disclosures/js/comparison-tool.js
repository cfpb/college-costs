/*jshint maxerr: 10000 */
/*  A script to control the Comparison Tool, including adding and removing schools, loading school data,
    performing data calculations on schools and loans, and handling UI elements and events. -wernerc */


//== CFPBComparisonTool represents a namespace for comparison tool classes and functions ==//

var CFPBComparisonTool = (function() {

    // Initialize values, objects, etc //
    var columns = new Object(); // Object (array-ish) that holds Column objects, keyed by column number
    var schools = new Object(); // Object (array-ish) that holds School objects, keyed by column number
    var schools_zeroed = new Object(); // Object for Google analytics, for schools where gap reaches 0
    var pies = []; // Object holding monthly loan pie chart Raphael objects (the whole object)
    var circles = []; // Object holding monthly loan pie chart Raphael objects (the outer circle part)
    var loans = []; // Object holding monthly loan pie chart Raphael objects (the pie part)
    var bars = []; // Object holding default rate bar Raphael objects (both bars, the whole shebang)
    var averagebars = []; // Object holding default rate bar Raphael objects (the average bar)
    var defaultbars = []; // Object holding default rate bar Raphael objects (the school's bar)
    var meters = []; // Object holding average loan Raphael objects (the whole meter)
    var meterarrows = []; // Object holding average loan Raphael objects (the needle/arrow)
    var previousXML = ""; // This holds the xml data last submitted for comparison in XML processing

	// A bunch of global defaults and such - see GLOBALS.txt for descriptions of the parameters
	var global = {
		"institutionalloanratedefault": 0.079, "privateloanratedefault": 0.079,
		"group1GradRankHigh": 636, "group1GradRankMed": 1269, "group1GradRankMax": 1873,
		"group2GradRankHigh": 470, "group2GradRankMed": 931, "group2GradRankMax": 1390,
		"group3GradRankHigh": 252, "group3GradRankMed": 498, "group3GradRankMax": 740,
		"group4GradRankHigh": 0, "group4GradRankMed": 0, "group4GradRankMax": 0,
		"group5GradRankHigh": 808, "group5GradRankMed": 1542, "group5GradRankMax": 2263,
		"group1GradMed": 39.4, "group1GradHigh": 57.8, "group2GradMed": 20.2, "group2GradHigh": 36.6,
		"group3GradMed": 35, "group3GradHigh": 63.9, "group4GradMed": 0, "group4GradHigh": 0, 
		"group5GradMed": 62.4, "group5GradHigh": 77, "cdrhigh": 100, "cdravg": 14.7, "cdrlow": 0.0, 
		"group1loanmed": 16081, "group1loanhigh": 21216, "group2loanmed": 7184, "group2loanhigh": 13834, 
		"group3loanmed": 8034, "group3loanhigh": 9501, "group4loanmed": 5000, "group4loanhigh": 12167, 
		"group5loanmed": 7321, "group5loanhigh": 9501,
		"group1loanrankmed": 667, "group1loanrankhigh": 1333, "group1loanrankmax": 2000,
		"group2loanrankmed": 470, "group2loanrankhigh": 939, "group2loanrankmax": 1409,
		"group3loanrankmed": 242, "group3loanrankhigh": 485, "group3loanrankmax": 727,
		"group4loanrankmed": 0, "group4loanrankhigh": 0, "group4loanrankmax": 0,
		"group5loanrankmed": 675, "group5loanrankhigh": 1349, "group5loanrankmax": 2024,
		"aaprgmlength": 2, "yrincollege": 1, "vet": false, "serving": "no", "program": "ba",
		"tier": 100, "gradprgmlength": 2, "familyincome": 48, "most_expensive_cost": 50000,
		"transportationdefault": 0, "roombrdwfamily": 0, "gibillch1606": 362,
		"perkinscapunder": 5500, "perkinscapgrad": 8000, "pellcap": 5730,
		"subsidizedcapyr1": 3500, "subsidizedcapyr2": 4500, "subsidizedcapyr3": 5500, 
		"unsubsidizedcapyr1": 5500, "unsubsidizedcapyr2": 6500, "unsubsidizedcapyr3": 7500,
		"unsubsidizedcapindepyr1": 9500, "unsubsidizedcapindepyr2": 10500, "unsubsidizedcapindepyr3": 12500, 
		"unsubsidizedcapgrad": 20500, "state529plan": 0, "perkinsrate": 0.05, "subsidizedrate": 0.0466, 
		"unsubsidizedrateundergrad": 0.0466, "unsubsidizedrategrad": 0.0621, 
        "dloriginationfee": 1.01073, "gradplusrate": 0.0721, 
		"parentplusrate": 0.0721, "plusoriginationfee": 1.04292, "homeequityloanrate": 0.079,
        "deferperiod": 6, "salary": 30922, 
		"salaryaa": 785, "salaryba": 1066, "salarygrad": 1300, "lowdefaultrisk": 0.08, "meddefaultrisk": 0.14, 
		"tfcap": 19198.31, "avgbah": 1429, "bscap": 1000, 
		"tuitionassistcap": 4500, "kicker": 0, "yrben": 0, "rop": 1, "depend": "independent",
		"schools_added": -1, "reached_zero": 0, "worksheet_id": "none"
	};

	//== Non-Class Functions ==//
	//-- exists() - a simple way to determine if any instance of an element matching the selector exists --//
    jQuery.fn.exists = function() {
        return this.length > 0;
    }

	//-- moneyToNum(): Convert from money string to number --//
	function moneyToNum(money) { 	
		if (typeof(money) !== "string") {
			return 0;
		} 
		else {
			return Number(money.replace(/[^0-9\.]+/g,""));	
		}
	} // end moneyToNum()

	//-- numToMoney(): Convert from number to money string --//
	function numToMoney(n) { 
        // When n is a string, we should, ironically, strip it numbers first.
        if (typeof n === 'string') {
            n =  Number(n.replace(/[^0-9\.]+/g,""));
        }
		var t = ",";
		if (n < 0) {
			var s = "-";
		}
		else {
			var s = "";
		}
		var i = parseInt(n = Math.abs(+n || 0).toFixed(0)) + "";
		var j = 0;
		if (i.length > 3) {
			j = ((i.length) % 3);
		}
		money = "$" + s;
		if (j > 0) {
			money += i.substr(0,j) + t;
		}
		money += i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t);
		return money;
	} // end numToMoney()


	//-- findEmptyColumn() - finds the first empty column, returns column number [1-3] --//
	function findEmptyColumn() {
		var column = false;
		for (var x = 1; x <= 3; x++) {
			var school_id = $("#institution-row [data-column='" + x + "']").attr("data-schoolid");
			if ( school_id === "" ) {
				column = x;
				break;
			}
		}
		return column;
	} // end findEmptyColumn()

	//-- Delay calculations after keyup --//
	var delay = (function(){ 
			var t = 0;
			return function(callback, delay) {
				clearTimeout(t);
				t = setTimeout(callback, delay);
			};
	})(); // end delay()

    //-- Perform all the functions necessary to (re)calculate and (re)draw the column --//
	function calculateAndDraw(columnNumber) {
        var newData = columns[columnNumber].fetchFormValues();
        if (schools[columnNumber] != undefined) {
            schools[columnNumber].recalculate(newData);
            var schoolData = schools[columnNumber].schoolData;
            columns[columnNumber].updateFormValues(schoolData);
            columns[columnNumber].drawCostBars(schoolData);
            columns[columnNumber].drawPieChart(schoolData);
            columns[columnNumber].drawDebtBurden(schoolData);
        }
	} // end calculateAndDraw()

    //-- clear all highlighted columns --//
    function clearHighlights() {
        for (var x=1;x<=3;x++) {
            columns[x].toggleHighlight("inactive");
        }        
    } // end clearHighlights()

	//-- Find results from API based on query and return and format them --//
    function getSchoolSearchResults(query) {
        var dump = "";
        var qurl = "api/search-schools.json?q=" + query;
        var cell = $("#step-two");
        var request = $.ajax({
            async: true,
            dataType: "json",
            url: qurl
        });
        request.done(function(response) {
            $.each(response, function(i, val) {
                dump += '<li class="school-result">';
                dump += '<a href="' + val.id + '">' + val.schoolname + '</a>';
                dump += '<p class="location">' + val.city + ', ' + val.state + '</p></li>';
            });
            if (dump == "") {
                cell.find(".search-results").html("<li><p>No results found</p></li>");
            }
            else {
                cell.find(".search-results").show();
                cell.find(".search-results").html(dump);
            }
        });
        request.fail(function() {
            // alert("ERROR");
        });
        return dump;
    } // end getSchoolSearchResults()


    //-- getWorksheetID() - gets a new worksheet id, and sets global.worksheet_id --//
    function getWorksheetID() {
        var request = $.ajax({
            type: "POST",
            async: false,
            url: "api/worksheet/"
        });
        request.done( function( data, textStatus, jqXHR) {
            var data = jQuery.parseJSON(jqXHR.responseText);
            global.worksheet_id = data.id;
        });
    } // end getWorksheetID()


    //-- process XML text into JSON, return a data object similar to schoolData --//

    function processXML(xml) {
        var parsererror = false;
        try {
            var xmlDoc = $.parseXML( xml );
            var $xmlObj = $( xmlDoc );         
        }
        catch (err) {
            parsererror = "Invalid XML Format";
        }

        if ( parsererror !== false ) {
            return false;
        }
        else {
            var schoolData = {};
            schoolData.books = moneyToNum( $xmlObj.find('books_and_supplies').text() );
            schoolData.roombrd = moneyToNum( $xmlObj.find('housing_and_meals').text() );
            schoolData.otherexpenses = moneyToNum( $xmlObj.find('other_education_costs').text() );
            schoolData.transportation = moneyToNum( $xmlObj.find('transportation').text() );
            schoolData.tuitionfees = moneyToNum( $xmlObj.find('tuition_and_fees').text() );

            schoolData.pell = moneyToNum( $xmlObj.find('federal_pell_grant').text() );
            schoolData.scholar = moneyToNum( $xmlObj.find('grants').text() );
            schoolData.scholar += moneyToNum( $xmlObj.find('grants_from_state').text() );
            schoolData.scholar += moneyToNum( $xmlObj.find('other_scholarships').text() );

            schoolData.staffsubsidized = moneyToNum( $xmlObj.find('federal_direct_subsidized_loan').text() );
            schoolData.staffunsubsidized = moneyToNum( $xmlObj.find('federal_direct_unsubsidized_loan').text() );
            schoolData.perkins = moneyToNum( $xmlObj.find('federal_perkins_loans').text() );

            schoolData.family = moneyToNum( $xmlObj.find('family_contribution').text() );

            schoolData.workstudy = moneyToNum( $xmlObj.find('work_study').text() );

            return schoolData;
        }

    } // end processXML()

    //-- Set the state of the Add a School section --//
    function setAddStage(stage, flag) {
        if (stage === 1) {
            $("#step-four .success-message").children().first().removeAttr("tabindex");
            $("#step-four .success-message").hide();
            $("#introduction .get-started").not("#step-one").hide();
            $("#introduction #step-one").fadeToggle( "slow", "linear" );
        }
        if (stage === 2) {
            $("#step-four .success-message").children().first().removeAttr("tabindex");
            $("#step-four .success-message").hide();
            $("#introduction .get-started").not("#step-two").hide();
            $("#introduction #step-two").children().first().attr("tabindex", "-1");
            $("#introduction #step-two").fadeToggle( "slow", "linear" );
            $("#introduction #step-two").children().first().focus();
            var col = findEmptyColumn();
            clearHighlights();
            columns[col].toggleHighlight("active");
        }
        if (stage === 3) {
            $("#introduction .get-started").not("#step-three").hide();
            $("#introduction #step-two").children().first().removeAttr("tabindex");
            $("#introduction #step-three").children().first().attr("tabindex", "-1");
            $("#introduction #step-three").fadeToggle( "slow", "linear" );
            $("#introduction #step-three").children().first().focus();
            $("#step-three .staged").hide();
            var financialAid = $("#finaidoffer").is(":checked");
            var kbyoss = $("#school-name-search").attr("data-kbyoss");
            var onCampus = $("#school-name-search").attr("data-oncampusavail");
            var inDistrict = $("#school-name-search").attr("data-indis");
            var tuitionInfo = $("#school-name-search").attr("data-tuitioninfo");
            var control = $("#school-name-search").attr("data-control");
            if (financialAid === true) {
                if (kbyoss == "Yes") {
                    $("#step-three .add-xml").children().first().attr("tabindex", "-1");
                    $("#step-three .add-xml").show();
                    $("#step-three .add-xml").children().first().focus();
                }
                else {
                    setAddStage(4, "success-offer-no-data");
                }
            }
            else if (tuitionInfo == "No") {
                setAddStage(4, "success-no-data");    
            }
            else if ($('#step-two input:radio[name="program"]:checked').val() == "grad") {
                setAddStage(4, "success-no-data");
            }
            else {
                $("#step-three .add-school").show();
                if (onCampus == "Yes") {
                    $('#step-three #housing-on-campus').children().first().attr("tabindex", "-1");
                    $('#step-three #housing-on-campus').show();
                    $('#step-three #housing-on-campus').children().first().focus();
                    $('#housing-radio-1').prop("checked", true);
                }
                else {
                    $("#step-three #housing-on-campus").hide();
                    $('#housing-radio-2').prop("checked", true);
                }

                if (control == "Public") {
                    $('#add-school-residency').children().first().attr("tabindex", "-1");
                    $('#add-school-residency').show();
                    $('#add-school-residency').children().first().focus();
                    if (inDistrict == "Yes") {
                        $("#step-three #residency-in-district").children().first().attr("tabindex", "-1");
                        $("#step-three #residency-in-district").show();
                        $("#step-three #residency-in-district").children().first().focus();
                        $('#residency-radio-1').prop("checked", true);
                    }
                    else {
                        $("#step-three #residency-in-district").hide();
                        $('#residency-radio-2').prop("checked", true);
                    }
                }
                else {
                    $('#add-school-residency').hide();
                    $('#residency-radio-2').prop("checked", true);
                }
            }
        }
        if (stage === 4) {
            $("#introduction #step-three").children().first().removeAttr("tabindex");
            $("#step-three #housing-on-campus").children().first().removeAttr("tabindex");
            $('#add-school-residency').children().first().removeAttr("tabindex");
            $("#step-three #residency-in-district").children().first().removeAttr("tabindex");
            $("#introduction .get-started").not("#step-four").hide();
            $("#introduction #step-four").fadeToggle("slow", "linear");
            $("#step-four .success-message").hide();
            if (flag !== undefined) {
                $('#' + flag).children().first().attr("tabindex", "-1");
                $('#' + flag).show();
                $('#' + flag).children().first().focus();
            }

            // Add the School
            var columnNumber = findEmptyColumn();
            var schoolID = $("#school-name-search").attr("data-schoolid");
            $('#institution-row [data-column="' + columnNumber + '"]').attr("data-schoolid", schoolID);
            schools[columnNumber] = new School(schoolID);
            schools[columnNumber].getSchoolData();
            schools[columnNumber].importAddForm();
            var schoolData = schools[columnNumber].schoolData;
            columns[columnNumber].addSchoolInfo(schoolData);

            if (flag == "success-offer-xml") {
                var xml = $('#xml-text').val();
                var data = processXML(xml);
                columns[columnNumber].updateFormValues(data);
            }
            else if (flag == "success-prepop") {
                var residency = $('input[name="step-three-residency"]:checked').val();
                if (residency == "indis") {
                    schoolData.tuitionfees = schoolData.tuitionunderindis;
                }
                else if (residency == "outstate") {
                    schoolData.tuitionfees = schoolData.tuitionundeross;
                }
                else {
                    schoolData.tuitionfees = schoolData.tuitionunderins;                    
                }
                
                var housing = $('input[name="step-three-housing"]:checked').val();
                if (housing == "oncampus") {
                    schoolData.roombrd = schoolData.roombrdoncampus;
                    schoolData.otherexpenses = schoolData.otheroncampus;
                }
                else if (housing == "offcampus") {
                    schoolData.roombrd = schoolData.roombrdoffcampus;
                    schoolData.otherexpenses = schoolData.otheroffcampus;   
                }
                else if (housing == "withfamily") {
                    schoolData.roombrd = global.roombrdwfamily;
                    schoolData.otherexpenses = schoolData.otherwfamily;
                }
                schoolData.transportation = global.transportationdefault;

                schools[columnNumber].touchedFields.push("transportation");
                schools[columnNumber].touchedFields.push("roombrd");
                schools[columnNumber].touchedFields.push("otherexpenses");

                columns[columnNumber].updateFormValues(schoolData);
            }

            $('#' + flag + ' .success-school-name').html(schoolData.school);
            var navigatorLink = "http://nces.ed.gov/collegenavigator/?id=" + schoolData.school_id;
            $('#' + flag + ' .navigator-link').attr('href', navigatorLink)

            if ( findEmptyColumn() === false ) {
                maxSchools(true);
            }
            calculateAndDraw(columnNumber);
            $("#get-started-button").html("Add another school");
            $("#save-and-share").show();
        }
    } // end setAddStage()

    //-- Activate/Deactivate Add Form (for when 3 schools are already there) --//
    function maxSchools(boolean) {
        // show/hide warning message, (de)activate #step-two add button
        if ( boolean === true ) {
            $('#step-one .max-schools').show();
            $('#get-started-button').attr('disabled', true).addClass('disabled');
        }
        else {
            $('#step-one .max-schools').hide();
            $('#get-started-button').removeAttr('disabled').removeClass('disabled');
        }
    } // end activateAddForm()

    //-- Clear the forms and values in the Add a School section --//
    function clearAddForms() {
    	$('#school-name-search').val('');
    	$('#school-name-search').attr('data-schoolid', '');
    	$('#prgmlength').val('4');
    	$('#step-two input:radio[name="program"]').filter('[value="ba"]').prop('checked', true);
        $('#finaidoffer').prop('checked', false);
    	$('#xml-text').val('');
        $('#step-two .continue').attr('disabled', true);
        $("#step-four .stage-success").hide();
        $('#step-three .xml-error').hide();
    } //

	/////===== Classes =====/////

	//== the School class represents the data structure of a school's data.
	//== This does NOT represent any UI or DOM elements - see Column()
	function School(schoolID) {
		this.schoolID = schoolID;
		this.schoolData = {};
        this.touchedFields = ["test"]; // Tracks which fields have been edited.
        this.xml = "";

		//-- Get schoolData values from API --//
		this.getSchoolData = function() { 
			// AJAX the schoolData
			var schoolData = this.schoolData;
			var queryURL = 'api/school/' + this.schoolID + '.json';
			var request = $.ajax({
				async: false,
				dataType: 'json',
				url: queryURL
			});
			request.done(function(response) {
				$.each(response, function(key, val) {
					key = key.toLowerCase();
					if (schoolData[key] == undefined) {
						schoolData[key] = val;
					}
				});
			});
			request.fail(function() {
				// Your fail message here.
			});

			this.schoolData = schoolData;
		} // end getSchoolData

		//-- Retrieve entered values from Add a School inputs --//
		this.importAddForm = function() { 
			this.schoolData['program'] = $('#step-two input:radio[name="program"]:checked').val();
			this.schoolData['prgmlength'] = parseInt($('#step-two select[name="prgmlength"]').val());

			// Set undergrad
			if ( this.schoolData.program === "grad" ) {
				this.schoolData.undergrad = false;
			}
			else {
				this.schoolData.undergrad = true;
			}

			// Set unsubsidized rate (there is a difference between grad and undergrad direct loan rates)
			if (this.schoolData.undergrad === true) {
				this.schoolData.unsubsidizedrate = global.unsubsidizedrateundergrad;
			}
			else {
				this.schoolData.unsubsidizedrate = global.unsubsidizedrategrad;
			}

			if ( this.schoolData.program === undefined ) {
				this.schoolData.program = "ba";
			}
			if ( this.schoolData.prgmlength == 0 ) {
				if (this.schoolData.program == "ba") {
					this.schoolData.prgmlength = 4;
				}
				else if (this.schoolData.program == "aa") {
					this.schoolData.prgmlength = 2;
				}
				else {
					this.schoolData.prgmlength = 2;
				}
			}

			// Unused (but required) variables
			this.schoolData.homeequity = 0;
			this.schoolData.parentplus = 0;

		} // end importAddForm()

		//-- recalculate() - Recalculate the schoolData --//
		this.recalculate = function(newData) {
			// join newData with existing schoolData object to form data object
			var data = this.schoolData
			$.each(newData, function(key, val) {
				data[key] = val;
			});

			// schoolData.yrincollege is set to global.yrincollege, possibly just for now
			data.yrincollege = global.yrincollege;

			// For calculations, add transportation and otherexpenses into personalcosts
			data.personal = data.transportation + data.otherexpenses;

			// tf in-state rate prepopulate (schoolData.tfinsprep)
			if ( ( data.control === "public" ) && ( data.program === "grad" ) ) {
				data.tfinstate = data.tuitiongradins;
			}
			else {
				data.tfinstate = data.tuitionunderins;
			}

			// netprice
			if (data.netpricegeneral < 0) {
				data.netprice = -1;
			}
			else {
				data.netprice = data.netpricegeneral;
			}

			// Start calculations
			// Cost of First Year (schoolData.firstyrcostattend)
			data.firstyrcostattend = data.tuitionfees + data.roombrd + data.books + data.otherexpenses + data.transportation;

			// SCHOLARSHIPS & GRANTS //
			// Pell Grants
			data.pell_max = 0;
			if ( data.undergrad == true ) {
				data.pell_max = global.pellcap;
			}
			if ( data.pell_max > data.firstyrcostattend ) {
				data.pell_max = data.firstyrcostattend;
			}
			if ( data.pell_max < 0 ) {
				data.pell_max = 0;
			}
			if (data.pell > data.pell_max){
				data.pell = data.pell_max;
			}

			// Military Tuition Assistance
			if ( global.tuitionassistcap < data.tuitionfees ) {
				data.tuitionassist_max = global.tuitionassistcap;
			}
			else {
				data.tuitionassist_max = data.tuitionfees;
			}
			if (data.tuitionassist > data.tuitionassist_max) {
				data.tuitionassist = data.tuitionassist_max;
			}

			// GI Bill
			// Set schoolData.tfinstate
			if ( data.instate == false ) {
				data.tfinstate = data.gibillinstatetuition;	
			}
			else {
				data.tfinstate = data.tuitionfees;
			}

			// Tuition & Fees benefits:
			if (global.vet == false) {
				data.gibilltf = 0; 
			}
			else {
				 
				// Calculate veteran benefits:		
				if ( ( data.control == "Public" ) && ( data.instate == true ) ) {
					data.gibilltf = ( data.tuitionfees - data.scholar - data.tuitionassist ) * global.tier;
					if ( data.gibilltf < 0 ) {
						data.gibilltf = 0;
					}
				}
				else if ( ( data.control == "Public" ) && ( data.instate == false ) ) {
					data.gibilltf = ( data.tfinstate + (global.yrben * 2) - data.scholar - data.tuitionassist ) * global.tier;
					if ( data.gibilltf < 0 ) {
						data.gibilltf = 0;
					}
					if ( data.gibilltf > ( ( data.tuitionfees - data.scholar - data.tuitionassist) * global.tier ) ) {
						data.gibilltf = data.tuitionfees * global.tier;
					}
				}
				else { // School is not public
					data.gibilltf = ( global.tfcap + (global.yrben * 2) - data.scholar - data.tuitionassist ) * global.tier;
					if ( data.gibilltf < 0 ) {
						data.gibilltf = 0;
					}
					if ( data.gibilltf > ( ( data.tuitionfees - data.scholar - data.tuitionassist) * global.tier ) ) {
						data.gibilltf = data.tuitionfees * global.tier;
					}
				}
			}

			// GI living allowance benefits:
			if (global.vet === false) {
				data.gibillla = 0;
			}
			else { 
				if (global.serving == "ad") { 
					data.gibillla = 0;
				}
				else if ( ( global.tier == 0 ) && ( global.serving == "ng" ) ) {
					data.gibillla = global.gibillch1606 * 9;
				}
				else {
					if (data.online == "Yes" ) {
						data.gibillla = ( ( ( global.avgbah / 2 * global.tier ) + global.kicker ) * global.rop) * 9;
					}
					else {
						data.gibillla = data.bah * global.tier * 9 * global.rop;
					}
				}
			}


			// GI Bill Book Stipend
			if (global.vet === false) {
				data.gibillbs = 0;
			}
			else {
				data.gibillbs = global.bscap * global.tier * global.rop;
			}

			// Total GI Bill
			data.gibill = data.gibilltf + data.gibillla + data.gibillbs;

			// Total Grants
			data.grantstotal = data.pell + data.scholar + data.gibill + data.tuitionassist;

			// First Year Net Cost
			data.firstyrnetcost = data.firstyrcostattend - data.grantstotal;

			// Total Contributions
			data.savingstotal = data.savings + data.family + data.state529plan + data.workstudy;
			
			// grants and savings
			data.totalgrantsandsavings = data.savingstotal + data.grantstotal;

			// FEDERAL LOANS //
			// Perkins Loan

			data.perkins_max = data.firstyrcostattend - data.pell;
			if ( data.perkins_max < 0 ) {
				data.perkins_max = 0;
			}
			if ( data.undergrad == true ) {
				if ( data.perkins_max > global.perkinscapunder ) {
					data.perkins_max = global.perkinscapunder;
				}
			}
			else {
				if ( data.perkins_max > global.perkinscapgrad ) {
					data.perkins_max = global.perkinscapgrad;
				}		
			}
			if (data.perkins > data.perkins_max) {
				data.perkins = data.perkins_max;
			}
				
			// Subsidized Stafford Loan
			if (data.undergrad == false) {
				data.staffsubsidized_max = 0;
			}
			else {
				if ((data.program == "aa") || (data.yrincollege == 1)) {
					data.staffsubsidized_max = data.firstyrcostattend - data.pell - data.perkins;
					if ( data.staffsubsidized_max > global.subsidizedcapyr1 ) {
						data.staffsubsidized_max = global.subsidizedcapyr1;
					}
					if ( data.staffsubsidized_max < 0 ) {
						data.staffsubsidized_max = 0;
					}
				}
				else if (data.yrincollege == 2) {
					data.staffsubsidized_max = data.firstyrcostattend - data.perkins - data.pell;
					if ( data.staffsubsidized_max > ( global.subsidizedcapyr2 - data.staffsubsidized ) ) {
						data.staffsubsidized_max = global.subsidizedcapyr2 - data.staffsubsidized ;
					}
					if ( data.staffsubsidized_max < 0 ) {
						data.staffsubsidized_max = 0;
					}
				}
				else if (data.yrincollege == 3) {
					data.staffsubsidized_max = data.firstyrcostattend - data.perkins - data.pell;
					if ( data.staffsubsidized_max > ( global.subsidizedcapyr3 - data.staffsubsidized ) ) {
						data.staffsubsidized_max = global.subsidizedcapyr3 - data.staffsubsidized ;
					}
					if ( data.staffsubsidized_max < 0 ) {
						data.staffsubsidized_max = 0;
					}
				}
			}
			if (data.staffsubsidized_max < 0){
				data.staffsubsidized = 0;
			}
			if (data.staffsubsidized > data.staffsubsidized_max){
				data.staffsubsidized = data.staffsubsidized_max;
			}

			//unsubsidized loan max for independent students
			if ( data.undergrad == false) { 
				data.staffunsubsidizedindep_max = data.firstyrcostattend - data.pell - data.perkins - data.staffsubsidized;
				if ( data.staffunsubsidizedindep_max > global.unsubsidizedcapgrad ) {
					data.staffunsubsidizedindep_max = global.unsubsidizedcapgrad;
				}
				if (data.staffunsubsidizedindep_max > global.unsubsidizedcapgrad - data.staffsubsidized) {
					data.staffunsubsidizedindep_max = global.unsubsidizedcapgrad - data.staffsubsidized;
				}
				if ( data.staffunsubsidizedindep_max < 0 ) {
					data.staffunsubsidizedindep_max = 0;
				}
			} 
			else {
				if ( ( data.program == "aa" ) || ( data.yrincollege == 1 ) ) { 
					data.staffunsubsidizedindep_max = data.firstyrcostattend - data.pell - data.perkins - data.staffsubsidized;
					if ( data.staffunsubsidizedindep_max > ( global.unsubsidizedcapindepyr1 - data.staffsubsidized ) ) {
						data.staffunsubsidizedindep_max = global.unsubsidizedcapindepyr1;
					}
					if (data.staffunsubsidizedindep_max > global.unsubsidizedcapindepyr1 - data.staffsubsidized) {
						data.staffunsubsidizedindep_max = global.unsubsidizedcapindepyr1 - data.staffsubsidized;
					}
					if ( data.staffunsubsidizedindep_max < 0 ) {
						data.staffunsubsidizedindep_max = 0;
					}
				}
				else if ( data.yrincollege == 2) { 
					data.staffunsubsidizedindep_max = data.firstyrcostattend - data.pell - data.perkins - data.staffsubsidized;
					if ( data.staffunsubsidizedindep_max > ( global.unsubsidizedcapindepyr2 - data.staffsubsidized ) ) {
						data.staffunsubsidizedindep_max = global.unsubsidizedcapindepyr2;
					}
					if ( data.staffunsubsidizedindep_max > global.unsubsidizedcapindepyr2 - data.staffsubsidized ) {
						data.staffunsubsidizedindep_max = global.unsubsidizedcapindepyr2 - data.staffsubsidized;
					}
					if ( data.staffunsubsidizedindep_max < 0 ) {
						data.staffunsubsidizedindep_max = 0;
					}
				}
				else if ( data.yrincollege == 3) { 
					data.staffunsubsidizedindep_max = data.firstyrcostattend - data.pell - data.perkins- data.staffsubsidized;
					if ( data.staffunsubsidizedindep_max > ( global.unsubsidizedcapindepyr3 - data.staffsubsidized ) ) {
						data.staffunsubsidizedindep_max = global.unsubsidizedcapindepyr3;
					}
					if ( data.staffunsubsidizedindep_max > global.unsubsidizedcapindepyr3 - data.staffsubsidized ) {
						data.staffunsubsidizedindep_max = global.unsubsidizedcapindepyr3 - data.staffsubsidized;
					}
					if ( data.staffunsubsidizedindep_max < 0 ) {
						data.staffunsubsidizedindep_max = 0;
					}
				}
			}
			// unsubsidized loan max for dependent students
			if ( data.undergrad == false ) {
				data.staffunsubsidizeddep_max = data.firstyrcostattend - data.pell - data.perkins - data.staffsubsidized;
				if ( data.staffunsubsidizeddep_max > global.unsubsidizedcapgrad - data.staffsubsidized) {
					data.staffunsubsidizeddep_max = global.unsubsidizedcapgrad - data.staffsubsidized;
				}
				if ( data.staffunsubsidizeddep_max < 0 ) {
					data.staffunsubsidizeddep_max = 0;
				}
			} 
			else if ( data.program == "aa" || data.yrincollege == 1 ) {
				data.staffunsubsidizeddep_max = data.firstyrcostattend - data.pell - data.perkins - data.staffsubsidized;
				if ( data.staffunsubsidizeddep_max > global.unsubsidizedcapyr1 - data.staffsubsidized) {
					data.staffunsubsidizeddep_max = global.unsubsidizedcapyr1 - data.staffsubsidized;
				}
				if ( data.staffunsubsidizeddep_max < 0 ) {
					data.staffunsubsidizeddep_max = 0;
				}
			}
			else if ( data.yrincollege == 2) { 
				data.staffunsubsidizeddep_max = data.firstyrcostattend - data.pell - data.perkins - data.staffsubsidized;
				if ( data.staffunsubsidizeddep_max > global.unsubsidizedcapyr2 - data.staffsubsidized) {
					data.staffunsubsidizeddep_max = global.unsubsidizedcapyr2 - data.staffsubsidized;
				}
				if ( data.staffunsubsidizeddep_max < 0 ) {
					data.staffunsubsidizeddep_max = 0;
				}
			} 
			else if ( data.yrincollege == 3 ) { 
				data.staffunsubsidizeddep_max = data.firstyrcostattend - data.pell - data.perkins - data.staffsubsidized;
				if ( data.staffunsubsidizeddep_max > (global.unsubsidizedcapyr3 - data.staffsubsidized) ) {
					data.staffunsubsidizeddep_max = global.unsubsidizedcapyr3 - data.staffsubsidized;
				}
				if ( data.staffunsubsidizeddep_max < 0 ) {
					data.staffunsubsidizeddep_max = 0;
				}
			}

			// Unsubsidized Stafford Loans
			if ( global.depend == "dependent" ) {
				data.staffunsubsidized_max = data.staffunsubsidizeddep_max;
			}
			else {
				data.staffunsubsidized_max = data.staffunsubsidizedindep_max;
			}
			if (data.staffunsubsidized_max < 0) {
				data.staffunsubsidized_max = 0;
			}
			if (data.staffunsubsidized > data.staffunsubsidized_max) {
				data.staffunsubsidized = data.staffunsubsidized_max;
			}

			// Gradplus
			if (data.undergrad == true) {
				data.gradplus_max = 0;
			}
			else {
				data.gradplus_max = data.firstyrnetcost - data.perkins - data.staffsubsidized - data.staffunsubsidized;
			}
			if ( data.gradplus_max < 0 ) {
				data.gradplus_max = 0;
			}
			if (data.gradplus > data.gradplus_max) {
				data.gradplus = data.gradplus_max;
			}

			// Federal Total Loan
			data.federaltotal = data.perkins + data.staffsubsidized + data.staffunsubsidized + data.gradplus;

			// PRIVATE LOANS //
			// Institution Loans
			data.institutionalloan_max = data.firstyrnetcost - data.perkins - data.staffsubsidized - data.staffunsubsidized - data.parentplus - data.gradplus - data.homeequity;
			if ( data.institutionalloan_max < 0 ) {
				data.institutionalloan_max = 0;
			}
			if (data.institutionalloan > data.institutionalloan_max) {
				data.institutionalloan = data.institutionalloan_max;
			}

			// Institutional Loan Rate
			if ( data.institutionalloanrate === undefined || data.institutionalloanrate === 0) {
				data.institutionalloanrate = global.institutionalloanratedefault;
			}
			if ( data.institutionalloanrate > .2 ) {
				data.institutionalloanrate = .2;
			}
			if ( data.institutionalloanrate < .01 ) {
				data.institutionalloanrate = .01;
			}

			data.privateloan_max = data.firstyrnetcost - data.perkins - data.staffsubsidized - data.staffunsubsidized - data.institutionalloan - data.gradplus;
			if ( data.privateloan_max < 0 ) {
				data.privateloan_max = 0;
			}
			if (data.privateloan > data.privateloan_max) {
				data.privateloan = data.privateloan_max;
			}

			// Private Loan Rate
			if ( data.privateloanrate === undefined || data.privateloanrate === 0 ) {
				data.privateloanrate = global.privateloanratedefault;
			}
			if ( data.privateloanrate > .2 ) {
				data.privateloanrate = .2;
			}
			if ( data.privateloanrate < .01 ) {
				data.privateloanrate = .01;
			}

			// Private Loan Total
			data.privatetotal = data.privateloan + data.institutionalloan;

			// gap
			data.gap = data.firstyrnetcost - data.perkins - data.staffsubsidized - data.staffunsubsidized - data.workstudy - data.savings - data.family - data.state529plan - data.privateloan - data.institutionalloan - data.parentplus - data.homeequity;

			// ===Loan Calculation===
			// Borrowing Total
			data.borrowingtotal = data.privatetotal + data.federaltotal;

			// Out of Pocket Total
			data.totaloutofpocket = data.grantstotal + data.savingstotal;

			// Money for College Total
			data.moneyforcollege = data.totaloutofpocket + data.borrowingtotal;
			
			// remainingcost -- "Left to Pay"
			data.remainingcost = data.firstyrnetcost - data.totaloutofpocket;
			if ( data.remainingcost < 0 ) {
				data.remainingcost = 0;
			}
			
			// loandebt1yr -- "Estimated Total Borrowing"
				data.loandebt1yr = data.perkins + data.staffsubsidized + data.staffunsubsidized + data.gradplus + data.privateloan + data.institutionalloan + data.parentplus + data.homeequity;

			// Borrowing over cost of attendance
			data.overborrowing = 0;
			if ( data.firstyrcostattend < ( data.outofpockettotal + data.borrowingtotal ) ) {
				data.overborrowing = data.borrowingtotal + data.outofpockettotal - data.firstyrcostattend;
			}

			// Estimated Debt Calculation
			// Perkins debt at graduation
			data.perkinsgrad = data.perkins * data.prgmlength;

			// Direct Subsidized Loan with 1% Origination Fee
			data.staffsubsidizedwithfee = data.staffsubsidized * global.dloriginationfee;

			// Subsidized debt at graduation
			data.staffsubsidizedgrad = data.staffsubsidizedwithfee * data.prgmlength;

			// Direct Unsubsidized Loan with 1% Origination Fee
			data.staffunsubsidizedwithfee = data.staffunsubsidized * global.dloriginationfee;

		    // Unsubsidized debt at graduation
		    data.staffunsubsidizedgrad = (data.staffunsubsidizedwithfee  * data.unsubsidizedrate / 12 * ((data.prgmlength * (data.prgmlength + 1) / 2 * 12 + data.prgmlength * global.deferperiod)) + (data.staffunsubsidizedwithfee  * data.prgmlength));

			// Grad Plus with origination
			data.gradpluswithfee = data.gradplus * global.plusoriginationfee;

			// Grad Plus debt at graduation
			data.gradplusgrad = (data.gradpluswithfee * global.gradplusrate  / 12 * ((data.prgmlength * (data.prgmlength + 1) / 2 * 12 + data.prgmlength * global.deferperiod)) + (data.gradpluswithfee * data.prgmlength));
			
			// Parent Plus Loans with origination fees
			data.parentpluswithfee = data.parentplus * global.plusoriginationfee;

			// Parent Plus Loans at graduation
			data.parentplusgrad = data.parentpluswithfee * data.prgmlength;

		    // Private Loan debt at graduation
		    data.privateloangrad = (data.privateloan * data.privateloanrate / 12  * ((data.prgmlength * (data.prgmlength + 1) / 2 * 12 + data.prgmlength * global.deferperiod)) + (data.privateloan * data.prgmlength));

		    // Institutional Loan debt at graduation
		    data.institutionalloangrad =  (data.institutionalloan * data.institutionalloanrate  / 12 * ((data.prgmlength * (data.prgmlength + 1) / 2 * 12 + data.prgmlength * global.deferperiod)) + (data.institutionalloan * data.prgmlength));
			
			// Home Equity Loans at graduation
			data.homeequitygrad = (data.homeequity * .079 / 12 * ((data.prgmlength * (data.prgmlength + 1) / 2 * 12)));

			// Debt after 1 yr
			data.loandebt1yr = data.perkins + data.staffsubsidized + data.staffunsubsidized + data.gradplus + data.privateloan + data.institutionalloan + data.parentplus + data.homeequity;

			// Total debt at graduation
			data.totaldebtgrad = data.perkinsgrad + data.staffsubsidizedgrad + data.staffunsubsidizedgrad + data.gradplusgrad + data.parentplusgrad + data.privateloangrad + data.institutionalloangrad + data.homeequitygrad;

			// repayment term
			if ( data.repaymentterminput == "10 years") { 
				data.repaymentterm = 10;
			} 
			else if ( data.repaymentterminput == "20 years") {
				data.repaymentterm =  20; 
			}
			else {
				data.repaymentterm = 10;
			}
			
			// loanmonthly - "Monthly Payments"
			data.loanmonthly =
			( data.perkinsgrad * ( global.perkinsrate / 12 ) / ( 1 - Math.pow((1 + global.perkinsrate / 12), ( -data.repaymentterm * 12 ) ) ) )
				+ (data.staffsubsidizedgrad 
					* (global.subsidizedrate / 12) / (1 - Math.pow((1 + global.subsidizedrate / 12), (-data.repaymentterm * 12))))
				+ (data.staffunsubsidizedgrad 
					* (data.unsubsidizedrate / 12) / (1 - Math.pow((1 + data.unsubsidizedrate / 12), (-data.repaymentterm  * 12))))
				+ (data.gradplusgrad * (global.gradplusrate / 12) / (1 - Math.pow((1 + global.gradplusrate /12), (-data.repaymentterm * 12))))
				+ (data.privateloangrad * (data.privateloanrate / 12) / (1 - Math.pow((1 + data.privateloanrate /12), (-data.repaymentterm * 12))))
				+ (data.institutionalloangrad 
					* (data.institutionalloanrate / 12) / (1 - Math.pow((1 + data.institutionalloanrate /12), (-data.repaymentterm * 12))));
			
			// loanmonthlyparent
			data.loanmonthlyparent = (data.parentplus * (global.parentplusrate / 12) / (Math.pow(1 - (1 + global.parentplusrate / 12), (-data.repaymentterm * 12)))) + (data.homeequity * (global.homeequityloanrate / 12) / (Math.pow(1 - (1 + global.homeequityloanrate / 12), (-data.repaymentterm * 12))));
			
			// loanlifetime
			data.loanlifetime = data.loanmonthly * data.repaymentterm  * 12;

			// salaryneeded
			data.salaryneeded = data.loanmonthly * 12 / 0.14;

			// Expected salary and Annual salary (educ lvl)
			if ( data.program == "aa" ) {
				data.salaryexpected25yrs = global.salaryaa * 52.1775;
			}
			else if ( data.program == "ba" ) {
				data.salaryexpected25yrs =  global.salaryba * 52.1775
			}
			else {
				data.salaryexpected25yrs = global.salarygrad * 52.1775;
			}
			data.salarymonthly = global.salary / 12;

			// Now update the School object's schoolData property to the finished data object.
			this.schoolData = data;

		} // end .recalculate()

	} // end School() class

	//== the Column class represents the DOM elements of a "school," including the inputs. Methods of this
	//== class manipulate the DOM, but also take data from inputs and place them into a schoolData object.
	//== Column also contains code for visualizations.
	function Column(number) {
		this.columnNumber = number; // defines which column, [1-3]
		var columnObj = $('[data-column="' + number + '"]'); // JQuery Object holding the DOM of the column
		var pixelPrice = 0; // The ratio of pixels to dollars for the bar graph
		var transitionTime = 200; // The transition time of bar graph animations
		var minimumChartSectionWidth = 5; // The minimum width of a bar graph section

		//-- Adds basic schoolData to the column --//
		this.addSchoolInfo = function(schoolData) {
            var navigatorlink = "http://nces.ed.gov/collegenavigator/?id=" + schoolData.school_id; 
			this.toggleActive('active'); // Make the column active
			columnObj.find('[data-nickname="institution_name"]').html(schoolData.school);
            $('.stage-success').find('span.success-school-name').html(schoolData.school);
            $(".stage-success").find("a.navigator-link").show().attr("href", navigatorlink);
			$('.header-cell[data-column="' + this.columnNumber + '"').attr("data-schoolid", schoolData.school_id);
            $('.header-cell[data-column="' + this.columnNumber + '"').attr("data-control", schoolData.control);
			columnObj.find('input.school-data').not(".interest-rate").val("$0");
			columnObj.find('input[data-nickname="institutional_loan_rate"]').val(global.institutionalloanratedefault * 100 + '%');
			columnObj.find('input[data-nickname="private_loan_rate"]').val(global.privateloanratedefault * 100 + '%');
            if (schoolData.program !== "grad") {
                columnObj.find("[data-nickname='gradplus']").attr("disabled", true).css('background-color', '#E3E4E5');
                columnObj.find("[data-nickname='staffsubsidized']").removeAttr("disabled").css('background-color', '');
            }
            else {
                columnObj.find("[data-nickname='gradplus']").removeAttr("disabled").css('background-color', '');
                columnObj.find("[data-nickname='staffsubsidized']").attr("disabled", true).css('background-color', '#E3E4E5');
            }
            // Set GI BIll residency visibility
            if (schoolData.control != "Public") {
                columnObj.find(".military-residency-panel").hide();
            }
            else {
                columnObj.find(".military-residency-panel").show();
            }
			this.drawSchoolIndicators(schoolData);
		} // end .addSchoolInfo()

		this.drawCostBars = function(schoolData) {
			var chartWidth = columnObj.find(".chart_mask_internal .full").width();
			var barBorderThickness = 1;
			var cost = moneyToNum(columnObj.find("[data-nickname='firstyrcostattend']").html());
            if (cost <= 0) {
                cost = 1;
            }
			var pixelPrice = chartWidth / cost;
			var left = 0;

			// Set section_width
			var totalSectionWidth = 0;
			var totalBorrowedSectionWidth = 0;
			var totalPocketSectionWidth = 0; // Out of Pocket Section

			columnObj.find(".bars-container").width(chartWidth);
            
			columnObj.find(".meter").show();
			// find each .bar element and determine its width, then animate
			columnObj.find(".bars-container").each(function() {
				var remainingWidth = chartWidth;
				$(this).find(".chart_mask_internal .bar").each(function() {
					var bar = $(this);
					var name = bar.attr("data-nickname");
					var value = schoolData[name];
					var sectionWidth = Math.floor(value * pixelPrice);
					if ( sectionWidth > remainingWidth ) {
						sectionWidth = remainingWidth;
					}
					if (sectionWidth < minimumChartSectionWidth) {
						sectionWidth = 0;
						bar.stop(true, false).animate({width: 0}, transitionTime, function() {
							bar.hide();
						});
					}
					else {
						sectionWidth = sectionWidth;
						bar.stop(true, false).animate({width: (sectionWidth - barBorderThickness)}, transitionTime);
					}

					if ( sectionWidth != 0) {
						bar.show();
						totalSectionWidth += sectionWidth;
						if ( $(this).hasClass("fedloans") || $(this).hasClass("privloans") ){					
							totalBorrowedSectionWidth += sectionWidth;
						}
						else {
							totalBorrowedSectionWidth += sectionWidth;
						}
					}
					else {
						bar.hide();
					}
					remainingWidth -= sectionWidth;
					if ( remainingWidth < 0 ) {
						remainingWidth = 0;
					}
				});
				if ((totalBorrowedSectionWidth + totalBorrowedSectionWidth) > chartWidth) {
					// columnObj.find(".error_msg").fadeIn(400);
					// This code will resize the bar past the width of the total cost
					// columnObj.find(".bars-container").width(totalBorrowedSectionWidth + totalBorrowedSectionWidth);
					// marginright = (totalBorrowedSectionWidth + totalBorrowedSectionWidth) - chartWidth;
					// columnObj.find(".tick.full").css("left", chartWidth - 2 );
				}
				else {
					// columnObj.find(".bars-container").width(chartWidth);
					columnObj.find(".error_msg").fadeOut(400);
				}
			}); 

		    left = 0 + totalBorrowedSectionWidth;
		    if ( left < 1 ) {
		    	// uncomment this line and the "total borrowed" will not float beyond the cost bar
		    	left = 0;
		    }
		    columnObj.find(".bar.borrowing").css("left", left);
		    columnObj.find(".bar.borrowing").css("width", totalBorrowedSectionWidth);
		    columnObj.find(".tick-borrowing").css("left", totalBorrowedSectionWidth + left - 2);
		    columnObj.find(".totalborrowing").css("padding-left", left);

		    if ( totalBorrowedSectionWidth < 1 ) {
		        // columnObj.find('.borrowing-container').hide(transitionTime);
		        // Hiding borrowing section for now
		        columnObj.find('.borrowing-container').hide();
		    }
		    else {
		        // columnObj.find('.borrowing-container').show(transitionTime);
		        // Hiding borrowing section for now
		        columnObj.find('.borrowing-container').hide();
		    }
	 	    var breakdownheight = $(".meter").height();
		    columnObj.find(".meter").closest("td").height(breakdownheight);
		} // End drawCostBars


	    //-- Draw the pie chart --//
		this.drawPieChart = function(schoolData) {
			$("#pie" + this.columnNumber).closest("td").children().show();
			var percentLoan = Math.round( ( schoolData.loanmonthly / schoolData.salarymonthly ) * 100 );
		    if ( percentLoan > 100 ) {
		    	percentLoan = 100;
		    }
		    columnObj.find(".payment-percent").html(percentLoan + "%");
		    var angle = percentLoan / 100 * 2 * Math.PI;
			var x = Math.sin(angle);
			x = 62 + ( x * 50 );
			var y = Math.cos(angle);
			y = 62 - ( y * 50 );
			var string = "M 62 62 L 62 12 ";
			if ( angle > Math.PI/2 ) {
				string += "A 50 50 0 0 1 112 62 ";
			}
			if ( angle > Math.PI ) {
				string += "A 50 50 0 0 1 62 112 ";
			}
			if ( angle > Math.PI * 1.5 ) {
				string += "A 50 50 0 0 1 12 62 ";
			}
			if ( angle > Math.PI * 2 ) {
				string += "A 50 50 0 0 1 62 12 ";
			}
			string += "A 50 50 0 0 1 " + x + " " + y + " z";
			loans[this.columnNumber].attr("path", string);			
		}

		//-- Draws the debt burden gauge --//
		this.drawDebtBurden = function(schoolData) {
            if ( schoolData.salarymonthly !== undefined ) {
                if ( schoolData.loanmonthly == 0) {
                    schoolData.riskofdefault = "None";
                    columnObj.find("[data-nickname='debtburden']").closest("td").css("background-position", "25px 0px");
                }
                else if ( schoolData.loanmonthly <= ( schoolData.salarymonthly * global.lowdefaultrisk ) ) {
                    schoolData.riskofdefault =  "Low";
                    columnObj.find("[data-nickname='debtburden']").closest("td").css("background-position", "25px -60px");
                }
                else if ( schoolData.loanmonthly <= ( schoolData.salarymonthly * global.meddefaultrisk ) ) {
                    schoolData.riskofdefault = "Medium";
                    columnObj.find("[data-nickname='debtburden']").closest("td").css("background-position", "25px -120px");
                }
                else {
                    schoolData.riskofdefault = "High";
                    columnObj.find("[data-nickname='debtburden']").closest("td").css("background-position", "25px -180px");
                }
                columnObj.find("[data-nickname='debtburden']").html(schoolData.riskofdefault);
            }
            else {
                columnObj.find("[data-nickname='debtburden']").html("");
                columnObj.find("[data-nickname='debtburden']").closest("td").css("background-position", "30% 60px");
            }           
        }

        //-- Draws the various indicators for a school --//
        this.drawSchoolIndicators = function(schoolData) { 
            // Clean up possible data gaps
            if ( schoolData.defaultrate == "" || schoolData.defaultrate == " ") {
                schoolData.defaultrate = "NR";
            }
            if ( schoolData.gradrate == "" || schoolData.gradrate == " ") {
                schoolData.gradrate = "NR";
            }            
            if ( schoolData.avgstuloandebt == "" || schoolData.avgstuloandebt == " ") {
                schoolData.avgstuloandebt = "NR";
            }
            if (schoolData.gradrate !== "NR") {
                schoolData.gradrate = parseFloat(schoolData.gradrate);
            }
            // Grad programs don't have indicators, nor group 4
            if ( (schoolData.undergrad != true) || (schoolData.indicatorgroup === "4") ) {
                columnObj.find(".graduation-rate-chart").hide();
                columnObj.find(".default-rate-chart").hide();
                columnObj.find(".median-borrowing-chart").hide();
                columnObj.find(".indicator-textbox").html("not available");
            }
            else { // Groups 1, 2, 3, and 5 have indicators
                // Draw the graduation rate chart
                columnObj.find(".gradrisk-percent").html(schoolData.gradrate + "%");
                // Note: ranks go from 1 to X, and X is "max"
                var barWidth = columnObj.find('.gradrisk-bar .low').outerWidth();
                barWidth += columnObj.find('.gradrisk-bar .medium').outerWidth();
                barWidth += columnObj.find('.gradrisk-bar .high').outerWidth();
                var offLeft = Math.floor( columnObj.find('.gradrisk-bar').innerWidth() - barWidth ) / 2;
                columnObj.find('.gradrisk-pointer').css('left', offLeft + 'px');
                columnObj.find('.gradrisk-percent').css('left', '-' + (offLeft * 2) + 'px');

		        var firstWidth = Math.ceil(barWidth / 3) - 5;
		        var secondWidth = Math.ceil(barWidth / 3) - 10;
		        var thirdWidth = Math.ceil(barWidth / 3) - 5;
		        var firstStop = 0 + offLeft;
		        var secondStop = Math.ceil(barWidth / 3) + 5;
 		        var thirdStop = Math.ceil(barWidth * 2 / 3) + 5;
                var grouphigh = parseFloat(global["group" + schoolData.indicatorgroup + "GradHigh"]);
                var groupmed = parseFloat(global["group" + schoolData.indicatorgroup + "GradMed"]);
                var grhigh = parseFloat(global["group" + schoolData.indicatorgroup + "GradRankHigh"]);
                var grmax = parseFloat(global["group" + schoolData.indicatorgroup + "GradRankMax"]);
                var grmed = parseFloat(global["group" + schoolData.indicatorgroup + "GradRankMed"]);
                var grhigh = parseFloat(global["group" + schoolData.indicatorgroup + "GradRankHigh"]);
                var rankcount = 1;
                var place = 1;
                var gradoffset = 0; 

                if ( ( schoolData.gradraterank != undefined ) && ( schoolData.gradrate != "NR" ) ) {
                    columnObj.find(".gradrisk-container").closest("td").children().show();
                    // Low
                    if ( schoolData.gradrate < groupmed ) {
                        rankcount = grmax - grmed;
                        place = schoolData.gradraterank - grmed;
                        gradoffset = firstStop + Math.floor( ( rankcount - place ) * ( firstWidth / rankcount))
                        columnObj.find(".gradrisk-indc").html("Low graduation rate");
                    }
                    // Med
                    else if ( schoolData.gradrate < grouphigh ) {
                        rankcount = grmed - grhigh;
                        place = schoolData.gradraterank - grhigh;
                        gradoffset = secondStop + Math.floor( ( rankcount - place ) * ( secondWidth / rankcount))
                        columnObj.find(".gradrisk-indc").html("Medium graduation rate");    
                    }
                    // High
                    else {
                        rankcount = grhigh;
                        place =  schoolData.gradraterank;
                        gradoffset = thirdStop + Math.floor( ( rankcount - place  ) * ( thirdWidth / rankcount ) );
                        columnObj.find(".gradrisk-indc").html("High graduation rate");
                    }
                    columnObj.find(".gradrisk-container").css("left", gradoffset + "px");
                }
                else {
                    columnObj.find(".graduation-rate-chart").hide();
                    columnObj.find(".gradrisk-text").html("not available"); 
                }


                // Draw the default rate indicator
                if ( schoolData.defaultrate != "NR" ) {
                    columnObj.find(".default-rate-chart").closest("td").children().show();
                    var height = ( schoolData.defaultrate / ( global.cdravg * 2 ) ) * 100;
                    var y = 100 - height;
                    defaultbars[this.columnNumber].attr({"y": y, "height": height});
                    if ( height > 100 ) {
                        var avgheight = ( global.cdravg / schoolData.defaultrate ) * 100;
                        var avgy = 100 - avgheight;
                        averagebars[this.columnNumber].attr({"y": avgy, "height": avgheight})
                    }
                    var percent = schoolData.defaultrate + "%";
                    columnObj.find(".default-rate-this .percent").html(percent);
                    var average = ( global.cdravg) + "%";
                    columnObj.find(".default-rate-avg .percent").html(average);
                }
                else {
                    columnObj.find(".default-rate-chart").hide();
                    columnObj.find(".defaultrisk-text ").html("not available");       
                }

                // Draw the avg borrowing meter
                var grouphigh = global["group" + schoolData.indicatorgroup + "loanhigh"];
                var groupmed = global["group" + schoolData.indicatorgroup + "loanmed"];
                var grhigh = global["group" + schoolData.indicatorgroup + "loanrankhigh"];
                var grmax = global["group" + schoolData.indicatorgroup + "loanrankmax"];
                var grmed = global["group" + schoolData.indicatorgroup + "loanrankmed"];
                var grhigh = global["group" + schoolData.indicatorgroup + "loanrankhigh"];
                var borrowangle = 0;
                var rankcount = 1;
                var place = 1;
                if ( ( schoolData.avgstuloandebtrank != undefined ) && ( schoolData.avgstuloandebt != "NR" ) ) {
                    columnObj.find(".median-borrowing-chart").closest("td").children().show();
                    // Low
                    if ( schoolData.avgstuloandebt < groupmed ) {
                        rankcount = grmed;
                        place = schoolData.avgstuloandebtrank;
                        borrowangle = 3 + Math.floor( ( place ) * ( 45 / rankcount ));
                        columnObj.find(".indicator-text").html("Low");
                    }
                    // Med
                    else if ( schoolData.avgstuloandebt < grouphigh ) {
                        rankcount = grhigh - grmed;
                        place = schoolData.avgstuloandebtrank - grmed;
                        borrowangle = 55 + Math.floor( ( place ) * ( 60 / rankcount ));
                        columnObj.find(".indicator-text").html("Medium");
                    }
                    // High
                    else {
                        rankcount = grmax - grhigh;
                        place =  schoolData.avgstuloandebtrank - grhigh;
                        borrowangle = 130 + Math.floor( ( place ) * ( 47 / rankcount ));
                        columnObj.find(".indicator-text").html("High");
                    }  
                    // Convert to radians
                    borrowangle = ( Math.PI * 2 * borrowangle ) / 360;
                    // Coordinates of indicating point
                    x = 100 - ( Math.cos(borrowangle) * 40 );
                    y = 100 - ( Math.sin(borrowangle) * 40 );
                    // coordinates of left base point
                    var trailingangle = borrowangle - ( Math.PI / 2 );
                    var x2 = 100 - ( Math.cos(trailingangle) * 4 );
                    var y2 = 100 - ( Math.sin(trailingangle) * 4 );
                    // coordinates of right base point
                    var leadingangle = borrowangle + ( Math.PI / 2 );
                    var x3 = 100 - ( Math.cos(leadingangle) * 4 );
                    var y3 = 100 - ( Math.sin(leadingangle) * 4 );
                    var path = "M " + x + " " + y + " L " + x2 + " " + y2 + " L " + x3 + " " + y3 + " z";
                    meterarrows[this.columnNumber].attr({"path": path, "fill": "#f5f5f5"});
                    meterarrows[this.columnNumber].toBack();
                    // Display borrowing amount in textbox
                    var content = "<em>" + numToMoney(schoolData.avgstuloandebt) + "</em>";
                    columnObj.find(".median-borrowing-text").html(content);
                    columnObj.find(".median-borrowing-text").css("font-weight", "600")
                }
                else {
                    columnObj.find(".median-borrowing-chart").hide();
                    columnObj.find(".median-borrowing-text").html("not available");
                }
            } 
        } // end .drawSchoolIndicators()

        //-- "fetch" (read) the values from the form elements into a data object --//
        this.fetchFormValues = function() {
            var data = {};
            columnObj.find("input.school-data").each(function() {
                data[$(this).attr("data-nickname")] = moneyToNum($(this).val());
                if ( $(this).hasClass("interest-rate") ) {
                    data[$(this).attr("data-nickname")] = ( moneyToNum( $(this).val() ) / 100 );
                }
            });
            // Get GI Bill Information
            global.serving = $('[data-column="1"] .military-status-select :selected').val();
            if (global.serving != "none") {
                global.vet = true;
            }
            else {
                global.vet = false;
            }

            global.tier = $("[data-column='1'] .military-tier-select").find(":selected").val();

            var instate = columnObj.find(".military-residency-panel :radio:checked").val();
            // Determine in-state and out-of-state
            if ( ( instate === "instate" ) || ( instate == "indistrict" ) ) {
                data.instate = true;
            }
            else {
                data.instate = false;
            }

            return data;
        } // end .fetchFormValues()

        //-- "fetch" the schoolID from the Column --//
        this.fetchSchoolID = function() {
            var schoolID = $('#institution-row [data-column="' + this.columnNumber + '"].header-cell').attr('data-schoolid');
            return schoolID;
        } // end .fetchSchoolID()

        this.toggleHighlight = function(state) {
        	if (state === "active") {
        		columnObj.each( function() {
                    if ( $(this).parent().is(".highlighted-row") ) {
                        $(this).css("background-color", "#f5f9fd");
                        $(this).filter("#institution-row th").css("border-top", "solid 5px #eaf3fb");
                    }
                });
        	}
        	if (state === "inactive") {
        		columnObj.each( function() {
                    if ( $(this).parent().is(".highlighted-row") ) {
                        $(this).css("background-color", "inherit");
                        $(this).filter("#institution-row th").css("border-top", "solid 5px #fff");
                    }
                });
        	}
        }

        //-- remove the school data from a column and reset it to default --//
        this.removeSchoolInfo = function() {
        	columnObj.find('[data-nickname="institution_name"]').html("School " + this.columnNumber);
        	columnObj.find('.remove-confirm').hide();
        	$('#institution-row [data-column="' + this.columnNumber + '"].header-cell').attr('data-schoolid', '');
        } // end removeSchoolInfo()

        //-- set an element value to the matching schoolData object property --//
        // Note: type can be 'c' for currency, or 'p' for percentage
        this.setByNickname = function(nickname, value, type) {
            var element = columnObj.find('[data-nickname="' + nickname + '"]');
            if (value === undefined) {
                value = 0;
            }
            var school_id = this.fetchSchoolID();
            if (type === "p") { // percentage type
                value = (value * 100).toString()
                var parts = value.split('.');
                if ( parts[1] === undefined ) {
                    value = parts[0] + '.0%';
                }
                else {
                    value = parts[0] + '.' + parts[1].substr(0,1) + '%';
                }
            }
            else if (type === "c" || type === undefined) {
                value = numToMoney(value);
            }
            else {
                // If the type is something weird, for now, we assume it meant currency
                value = numToMoney(value);
            }
            // Use val() or html() based on tagName
            if ( element.prop('tagName') === 'INPUT' ) {
                var columnNumber = this.columnNumber;
                if ( moneyToNum(value) === 0 ) {
                    if ( $.inArray(nickname, schools[columnNumber].touchedFields) === -1) {
                        value = "$";
                    }
                    else {
                        value = "$0";
                    }
                }
                element.val(value);
            }
            else {
                element.html(value);
            }
        }; // .setByNickname()

        //-- toggles "active" or "inactive" state of the column --//
        this.toggleActive = function(state) { 
            // list of elements to toggle
            var grays = '.school-data, .visualization, .data-total, h6';
            var ninjas = '.hide-on-inactive';

            // Now we can alter the state to 'state'
            if (state === 'active') {
                columnObj.find(ninjas).show();
                columnObj.find(grays).removeClass('inactive');
                columnObj.find('div[data-nickname="institution_name"]').removeClass('inactive');
                columnObj.find('span.institution-name').removeClass('inactive');
                columnObj.find('input').removeAttr('disabled');
                circles[this.columnNumber].attr({fill: "Gray"});
            }

            if (state === 'inactive') {
                columnObj.find(ninjas).hide();
                columnObj.find(grays).addClass('inactive');
                columnObj.find('div[data-nickname="institution_name"]').addClass('inactive');
                columnObj.find('span.institution-name').addClass('inactive');
                columnObj.find("[data-nickname='debtburden']").closest("td").css("background-position", "30% 60px");
                columnObj.find('input.school-data').val('$').attr('disabled', true);
                columnObj.find('.data-total').html('$0');
                circles[this.columnNumber].attr({fill: "#babbbd"});
            }

        } // end .toggleActive()

        //-- Updates Column with new values for inputs and totals --//
        this.updateFormValues = function(data) { 
            var column = this;
            columnObj.find('.data-total, .school-data, .value').each(function() {
                var nickname = $(this).attr('data-nickname');
                var value = data[nickname];
                if ( $(this).hasClass('interest-rate') ) {
                    column.setByNickname(nickname, value, "p");
                }
                else {
                    column.setByNickname(nickname, value, "c")
                }
                // set grad field to 'not available' if not grad program
                if (data.program !== "grad") {
                    columnObj.find('[data-nickname="gradplus"]').val("Not available");
                }
                else if (data.program === "grad") {
                    columnObj.find('[data-nickname="staffsubsidized"]').val("Not available");
                }

            });

        } // end .updateFormValues()

    } // end Column() class

    //== Functions for Save modal dialog ==//
    //== Code from https://github.com/gdkraus/accessible-modal-dialog ==//

    /*
 
     ============================================
     License for Application
     ============================================
     
     This license is governed by United States copyright law, and with respect to matters
     of tort, contract, and other causes of action it is governed by North Carolina law,
     without regard to North Carolina choice of law provisions.  The forum for any dispute
     resolution shall be in Wake County, North Carolina.
     
     Redistribution and use in source and binary forms, with or without modification, are
     permitted provided that the following conditions are met:
     
     1. Redistributions of source code must retain the above copyright notice, this list
     of conditions and the following disclaimer.
     
     2. Redistributions in binary form must reproduce the above copyright notice, this
     list of conditions and the following disclaimer in the documentation and/or other
     materials provided with the distribution.
     
     3. The name of the author may not be used to endorse or promote products derived from
     this software without specific prior written permission.
     
     THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
     WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
     AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE
     LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
     DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
     THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
     ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     
     */

     // jQuery formatted selector to search for focusable items when modal launches
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

    // Store the item that has focus before opening the modal window
    var focusedElementBeforeModal;

    function usingSafari() {
        var ua = navigator.userAgent.toLowerCase(); 
        if (ua.indexOf('safari')!=-1){ 
            if( ua.indexOf('chrome')  > -1 ) {
                return false; // chrome
            } else {
                return true; // safari
            }
        } else {
            return false;
        }
        
    }

    function trapSpaceKey(obj, evt, f) {
        // If space key pressed
        if (evt.which == 32) {
            // Fire the user passed event
            f();
            evt.preventDefault();
        }
    }

    function trapEscapeKey(obj, evt) {

        // If escape pressed
        if (evt.which == 27) {

            // Get list of all children elements in given object
            var o = obj.find('*');

            // Get list of focusable items
            var cancelElement;
            cancelElement = o.filter("#close-modal")

            // Close the modal window
            cancelElement.click();
            evt.preventDefault();
        }

    }

    function trapTabKey(obj, evt) {

        // If tab or shift-tab pressed
        if (evt.which == 9) {

            // Get list of all children elements in given object
            var o = obj.find('*');

            // Get list of focusable items
            var focusableItems;
            focusableItems = o.filter(focusableElementsString).filter(':visible')

            // Get currently focused item
            var focusedItem;
            focusedItem = $(':focus');

            // Get the number of focusable items
            var numberOfFocusableItems;
            numberOfFocusableItems = focusableItems.length

            // get the index of the currently focused item
            var focusedItemIndex;
            focusedItemIndex = focusableItems.index(focusedItem);

            if (evt.shiftKey) {
                // Back tab
                // If focused on first item and user preses back-tab, go to the last focusable item
                if (focusedItemIndex == 0) {
                    focusableItems.get(numberOfFocusableItems - 1).focus();
                    evt.preventDefault();
                }

            } else {
                // Forward tab
                // If focused on the last item and user preses tab, go to the first focusable item
                if (focusedItemIndex == numberOfFocusableItems - 1) {
                    focusableItems.get(0).focus();
                    evt.preventDefault();
                }
            }
        }

    }

    function setInitialFocusModal(obj) {
        // Get list of all children elements in given object
        var o = obj.find("*");

        // Set focus to first focusable item
        var focusableItems;
        focusableItems = o.filter(focusableElementsString).filter(":visible").first().focus();

    }

    function showModal(obj) {
        $("#page").attr("aria-hidden", "true"); // mark the main page as hidden
        $("#modal-overlay").css("display", "block"); // insert an overlay to prevent clicking and make a visual change to indicate the main apge is not available
        $("#modal").css("display", "block"); // make the modal window visible
        $("#modal").attr("aria-hidden", "false"); // mark the modal window as visible

        // Save current focus
        focusedElementBeforeModal = $(":focus");

        // Get list of all children elements in given object
        var o = obj.find('*');

        // Safari and VoiceOver shim
        // If VoiceOver in Safari is used, set the initial focus to the modal window itself instead of the first keyboard focusable item. This causes VoiceOver to announce the aria-labelled attributes. Otherwise, Safari and VoiceOver will not announce the labels attached to the modal window.
        if(usingSafari()) {
            // set a tabIndex of -1 to the modal window itself so we can set the focus on it
            $('#modal').attr('tabindex','-1');
            
            // set the focus to the modal window itself
            obj.focus();
        } else {
            // set the focus to the first keyboard focusable item
            o.filter(focusableElementsString).filter(':visible').first().focus();
        }

        // Set the focus to the first keyboard focusable item
        o.filter(focusableElementsString).filter(":visible").first().focus();


    }

    function hideModal() {
        $("#modal-overlay").css("display", "none"); // remove the overlay in order to make the main screen available again
        $("#modal").css("display", "none"); // hide the modal window
        $("#modal").attr("aria-hidden", "true"); // mark the modal window as hidden
        $("#page").attr("aria-hidden", "false"); // mark the main page as visible

        // set focus back to element that had it before the modal was opened
        focusedElementBeforeModal.focus();
    }

    //-----------------------//
    //    DOCUMENT.READY     //
    //-----------------------//

    $(document).ready(function() {
        if ( $("#comparison-tables").exists() ) { // Added for ease of testing

            // --- Initialize Visualizations --- //
            // Pie Charts
            var x;
            for (x = 1; x <= 3; x++ ) {
                pies[x] = Raphael($("[data-column='" + x + "'] .debt-pie")[0], 125, 125);
                pies[x].circle(62, 62, 50);
                circles[x] = pies[x].circle(62, 62, 50);
                circles[x].attr({fill: "Gray", stroke: "White", "stroke-width": 2});
                loans[x] = pies[x].path("M 62 62");
                loans[x].attr({fill: "Red", stroke: "White", "stroke-width": 2});   
            }

            // Default Rate Bars
            for (x = 1; x <= 3; x++ ) {
                bars[x] = Raphael($("[data-column='" + x + "'] .default-rate-chart")[0], 200, 100);
                var bottomline = bars[x].path("M 0 100 L 200 100");
                bottomline.attr({"stroke": "#585858", "stroke-width": 3})
                averagebars[x] = bars[x].rect(120, 50, 60, 50);
                averagebars[x].attr({"fill":"#585858", "stroke": "#585858"});
                defaultbars[x] = bars[x].rect(20, 100, 60, 0);
                defaultbars[x].attr({"fill":"#585858", "stroke": "#585858"});
            }

            // Borrowing meter
            for (x = 1; x <= 3; x++ ) {
                meters[x] = Raphael($("[data-column='" + x + "'] .median-borrowing-chart")[0], 200, 100);
                var circle = meters[x].circle(101, 100, 8);
                circle.attr({"stroke": "#585858", "stroke-width": 1, "fill": "#585858"});
                meterarrows[x] = meters[x].path("M 100 100 L 50 100");
                meterarrows[x].attr({"stroke": "#f5f5f5", "stroke-width": 2});
            }

	        // Initialize columns[] with an instance of Column() for each column
	        for (var x=1;x<=3;x++) {
	            columns[x] = new Column(x);
                // Make all columns inactive
                columns[x].toggleActive("inactive");
	        }

            // Notification for mobile screens //
            $("#pfc-notification-wrapper").hide();
            $("#pfc-notification-wrapper").delay(1500).slideDown(1000);

            $("#pfc-close-bar, #pfc-close-text").click(function() {
                $("#pfc-notification-wrapper").slideUp(1000);
            });

            // Make the drop down menus accessible on focus //
            $(".pfc-nav-wrapper").find( "a, .fake-link" ).on( "focus blur", function() {
                $(this).parents().toggleClass( "focus" );
            } );
            
            // Set up special vertical tabbing for comparison-tables
            for (c = 1; c <= 3; c++) {
                var tabOrder = 1;
                var selectors = "input.school-data, .gibill-calculator, .rate-change, .arrw-click";
                $('[data-column="' + c + '"]').find(selectors).each(function() {
                    var i = (c * 100) + tabOrder;
                    $(this).attr("data-tab-order", i);
                    tabOrder++;
                });
            }

        //---------------------------//
        //    JQUERY EVENT HANDLERS
        //---------------------------//

            // Modal save dialog
            $("#modal-overlay").css("display", "none");
            $("#page").attr("aria-hidden", "false"); // mark the main page as visible

            $("#save-and-share").click(function(e) {
                showModal($('#modal'));
            });
            $("#close-modal").click(function(e) {
                hideModal();
            });
            $("#close-modal").keydown(function(event) {
                trapSpaceKey($(this), event, hideModal);
            });
            $("html").on("click", "#modal-overlay", function(e) {
                hideModal();
                $("html").off("click");
            });
            $("#modal").keydown(function(event) {
                trapTabKey($(this), event);
            });
            $("#modal").keydown(function(event) {
                trapEscapeKey($(this), event);
            });

            // Accordions (not the instrument, sadly)
            $('tr.show').click(function() {
                $(this).closest('tbody').children(':not(.show, .tr-hide)').toggleClass('hide');
                $(this).closest('.arrw-collapse').toggleClass('arrw');
                if ( $(this).closest('.arrw-collapse').hasClass('arrw') ) {
                    var text = "Collapse";
                    $(this).find('.arrw-collapsable').html(text);
                }
                else {
                    var text = "Expand";
                    $(this).find('.arrw-collapsable').html(text);
                }
            });
            $('.arrw-click').click(function(ev) {
                ev.preventDefault();
            });

            // Show the instructions on expand the first time and let it be
            $('tr.totalcont').click(function() {
                $('tr.instructions').removeClass('tr-hide');
            });
            $('.grants').click(function() {
                $('.grants-row:not(.instructions)').toggleClass('tr-hide');
                $(this).closest('.arrw-collapse').toggleClass('arrw');
            });
            $('.federal').click(function() {
                $('.federal-row:not(.instructions)').toggleClass('tr-hide');
                $(this).closest('.arrw-collapse').toggleClass('arrw');
            });
            $('.private').click(function() {
                $('.private-row:not(.instructions)').toggleClass('tr-hide');
                $(this).closest('.arrw-collapse').toggleClass('arrw');
            });
            $('.contributions').click(function() {
                $('.contrib-row:not(.instructions)').toggleClass('tr-hide');
                $(this).closest('.arrw-collapse').toggleClass('arrw');
            });

            // "Add a school" user interface

            // User clicks "Get Started"
            $("#get-started-button").click( function(event) {
                event.preventDefault();
                setAddStage(2);
            });

            // [step-two] User has typed into the school-search input - perform search and display results
            $("#step-two .school-search").on("keyup", "#school-name-search", function (ev) {
                var query = $(this).val();
                $("#step-two .continue").addClass("disabled").attr("disabled", true);
                $("#step-two .search-results").show();
                $("#step-two .search-results").html("<li><em>Searching...</em></li>");
                delay(function() {
                    if ( query.length > 2 ) {
                        getSchoolSearchResults(query);
                    }
                    else {
                        var msg = "<li><p>Please enter at least three letters to search.</p></li>"
                        $("#step-two .search-results").html(msg);
                    }
                }, 500);
            });

            // [step-two] User clicks on a school from the search-results list
            $("#step-two .search-results").on("click", ".school-result a", function(event) {
                event.preventDefault();
                $('#finaidoffer').focus();

                var school_id = $(this).attr("href");

                // AJAX the schoolData
                var schoolData = new Object();
                var surl = "api/school/" + school_id + ".json";
                var request = $.ajax({
                    async: false,
                    dataType: "json",
                    url: surl
                });
                request.done(function(response) {
                    $.each(response, function(i, val) {
                        i = i.toLowerCase();
                        if (schoolData[i] == undefined) {
                            schoolData[i] = val;
                        }
                    });
                });
                request.fail(function() {
                    // Your fail message here.
                }); 
                $("#school-name-search").attr("data-schoolid", school_id);
                // does the school participate in the electronic shopping sheet?
                $("#school-name-search").attr("data-kbyoss", schoolData.kbyoss);
                // does the school have on-campus housing?
                $("#school-name-search").attr("data-oncampusavail", schoolData.oncampusavail);
                // Control of the school
                $("#school-name-search").attr("data-control", schoolData.control);
                // does the school have in-district !== in-state?
                if ( schoolData.tuitionunderindis !== schoolData.tuitionunderins ) {
                    $("#school-name-search").attr("data-indis", "Yes");
                }
                else {
                    $("#school-name-search").attr("data-indis", "No");
                }
                // does the school have tuitionunderins, meaning it has data?
                if (schoolData.tuitionunderins == "") {
                    $("#school-name-search").attr("data-tuitioninfo", "No");
                }
                else {
                    $("#school-name-search").attr("data-tuitioninfo", "Yes");
                }

                $("#school-name-search").val($(this).html());
                $("#step-two .search-results").html("").hide();
                $("#step-two .continue").removeClass("disabled").removeAttr("disabled");
                $('body').scrollTop( $('#introduction').offset().top - 50 );
            });


            // [step-two] User clicks Continue at step-two
            $("#step-two .continue").click( function(ev) {
                ev.preventDefault();
            	if ( $("#step-two .continue").attr("disabled") === undefined ) {
                    setAddStage(3);
                }
            });

            // [step-three] User clicks Continue at step-three
            $("#step-three .continue").click( function(ev) {
                ev.preventDefault();
                var kbyoss = $("#school-name-search").attr("data-kbyoss")
                var financialAid = $("#finaidoffer").is(":checked");
                if (kbyoss == "Yes" && financialAid === true) {
                    var xml = $('#xml-text').val();
                    if (xml !== undefined & xml !== "") {
                        var data = processXML(xml);
                    }
                    if (xml == "") {
                        data = false;
                    }
                    if (data === false) {
                        if ( xml === previousXML ) {
                            data = "invalid"; // Invalid XML entered twice, so ignore XML
                        }
                        else {
                            previousXML = xml;
                            $('#step-three .xml-error').show();
                        }
                    }
                    if (data !== false) {
                        if (data == "invalid") {
                            $('#step-four .no-cost-data').show();
                            setAddStage(4, "success-offer-no-data");
                        }
                        else {
                            $('#step-four .valid-xml').show();
                            setAddStage(4, "success-offer-xml");
                        }
                    }
                }
                else {
                    setAddStage(4, "success-prepop");
                }
            });


            // [step-four] User clicks Continue at step-four
            $("#step-four .continue").click( function(ev) {
                ev.preventDefault();
            	clearAddForms();
                setAddStage(1);
                // Open Cost of attendance, if necessary
                if ( $("#open").hasClass("arrw") ) {
                    $(document.body).animate({'scrollTop': $("#comparison-tables").offset().top }, 750);
                }
                else {
                    $("#open").trigger("click");
                    $(document.body).animate({'scrollTop': $("#comparison-tables").offset().top }, 750);
                }
            });

            // [step-four] User clicks Add Another School at step-four
            $("#step-four .add-another-school").click( function() {
            	clearAddForms();
                if (findEmptyColumn() === false) {
                    setAddStage(1);
                }
                else {
                    setAddStage(2);
                }
            });

            // Cancel Add a School
            $("#introduction .add-cancel").click( function(event) {
                event.preventDefault();
                setAddStage(1);
                clearAddForms();
            });

            // ---"Remove this school" user interface--- //

            // Remove a school (display confirmation)
            $(".remove-this-school").on('click', '.remove-school-link', function(ev) {
                $('.remove-confirm').hide();
                var columnNumber = $(this).closest("[data-column]").attr("data-column");
                if (columns[columnNumber].fetchSchoolID() != "") {
                    var removeWindow = $(this).closest(".removal-row").children(".remove-confirm");
                    removeWindow.show();
                    ev.stopPropagation();
                    $('html').on('click', 'body', function() {
                        removeWindow.hide();
                        $('html').off('click');
                    });
                }
            });

            // Remove school (confirmed, so actually get rid of it)
            $(".remove-confirm .remove-yes").click( function() {
                var columnNumber = $(this).closest("[data-column]").attr("data-column");
                var schoolID = columns[columnNumber].fetchSchoolID();
                $('[data-column="' + columnNumber + '"]').find('.school-data').val('$0');
                calculateAndDraw(columnNumber);
                columns[columnNumber].removeSchoolInfo();
                columns[columnNumber].toggleActive('inactive');
                delete schools[columnNumber];
                if ( Object.keys(schools).length === 0 ) {
                    $("#get-started-button").html("Get started");
                }
                maxSchools(false); 
            });

            // Wait, no, I don't want to remove it!
            $(".remove-confirm .remove-no").click( function() {
                $(this).closest(".removal-row").children(".remove-confirm").hide();
            })

            // -----------
            // "GI Bill" user interface
            // ------------
            // Show the GI Bill panel on click
            $(".gibill-calculator, input[data-nickname='gibill']").click( function(event) {
                event.stopPropagation();
                var giBillDataColumn = $(this).parents('[data-column]').find('.gibill-panel');
                giBillDataColumn.toggle();
                if ( $(this).parents('[data-column]').find('.gibill-panel').is(":visible")) {
                    $("html").on("click", "body", function() {
                        giBillDataColumn.hide();
                        $('html').off('click');
                    });
                    $('.gibill-panel, #tooltip-container').on('click', function(event) {
                        event.stopPropagation();
                        $('#tooltip-container').hide();
                    });
                }
            });

            // Using the service selectors changes all selectors and activates service tier.
            $(".military-status-select").change( function() {
                var value = $(this).val();
                $(".military-status-select").each( function() {
                    $(this).val(value);
                });
                if ( $(this).val() != "none" ) {
                    $(".military-tier-select").each( function() {
                        $(this).removeAttr("disabled");
                    });
                }
                else {
                    $(".military-tier-select").each( function() {
                        $(this).attr("disabled", true);
                    });
                }
                for ( c = 1; c <= 3; c++ ) {
                    calculateAndDraw(c);
                }
            });

            // Selecting an option from tier sets all tier to that value
            $(".military-tier-select").change( function() {
                var value = $(this).val();
                $(".military-tier-select").each( function() {
                    $(this).val(value);
                });
                for ( c = 1; c <= 3; c++ ) {
                    calculateAndDraw(c);
                }
            });

            // Selecting an option from residency modifies instate box visibility
            $(".military-residency-panel .radio-input").change( function() {
                var value = $(this).val();
                if ( value == "outofstate") {
                    $(this).closest(".military-residency-panel").find(".military-instate").slideDown();
                    $(this).closest(".military-residency-panel").find(".military-instate").css("display", "block");
                }
                else {
                    $(this).closest(".military-residency-panel").find(".military-instate").slideUp();
                }
            });

            // Clicking "Calculate" button hides GI Bill panel and performs a calculation
            $(".gibill-panel .military-calculate").click( function() {
                var columnNumber = $(this).closest("[data-column]").attr("data-column");
                $("[data-column='" + columnNumber + "'] .gibill-panel").hide();
                calculateAndDraw(columnNumber);
            })

            // Interest Rate change buttons
            $(".rate-change").on("click", function(event) {
                event.preventDefault();
                var column = $(this).closest("[data-column]").attr("data-column");
                var rateinput = $(this).closest("td").find("input.interest-rate");
                var loanrate = moneyToNum( rateinput.val() );
                var nickname = rateinput.attr('data-nickname');
                if ( $(this).hasClass("up") ) {
                    loanrate += .1;
                }
                if ( $(this).hasClass("down") ) {
                    loanrate -= .1;
                }
                loanrate = Math.round( loanrate * 10 ) / 10; // Round to tens place
                loanrate = loanrate / 100;

                columns[column].setByNickname(nickname, loanrate, 'p');
                calculateAndDraw(column);
            });

            // --------------------------------
            //    "Real-time" calculations
            // --------------------------------

            // Perform a calculation when the user blurs inputs
            $("#comparison-tables").on("blur", "input.school-data", function (ev) {
                var column = $(this).closest("[data-column]").attr("data-column");
                calculateAndDraw(column);
            });

            // Disable keydown and keypress for enter key - IE8 fix
            $("#comparison-tables").on("keypress keydown", " input.school-data", function(event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            });

            // Perform a calculation when a keyup occurs in the school fields...
            $("#comparison-tables").on("keyup", "input.school-data", function (ev) {
                var columnNumber = $(this).closest("[data-column]").attr("data-column");
                var school_id = columns[columnNumber].fetchSchoolID();
                var nickname = $(this).attr('data-nickname');
                var value = $(this).val();
                // ...immediately when the user hits enter
                if (ev.keyCode == 13) {
                    ev.preventDefault();
                    // Touch the input field
                    schools[columnNumber].touchedFields.push(nickname);
                    calculateAndDraw(columnNumber);
                }
                // .. after a delay if any other key is pressed
                delay(function() {
                    if (value !== "$") {
                        schools[columnNumber].touchedFields.push(nickname);
                    }
                    calculateAndDraw(columnNumber);
                    }, 500);
            });

            // Manually move focus when user presses tab in the #comparison-tables inputs
            $("#comparison-tables").on("keydown", "input.school-data", function (ev) {
                var code = event.keyCode || event.which;
                if (code == 9) {
                    var tabOrder = parseInt($(this).attr('data-tab-order'));
                    if (event.shiftKey) {
                        var nextTab = tabOrder - 1;
                    }
                    else {
                        var nextTab = tabOrder + 1; 
                    }

                    var nextInput = $('[data-tab-order="' + nextTab + '"]:visible');
                    if ( nextInput.length > 0 && nextInput.attr('disabled') == undefined ) {
                        event.preventDefault();
                        nextInput.focus();
                    }

                    else {
                        if (event.shiftKey) {
                            var column = Math.floor(tabOrder / 100) - 1
                            nextInput = $('[data-column="' + column + '"] input:visible').last();
                        }
                        else {
                            nextTab = Math.ceil(tabOrder / 100) * 100  + 1;
                            nextInput = $('[data-tab-order="' + nextTab + '"]:visible');
                        }
                        if ( nextInput.length > 0 && nextInput.attr('disabled') == undefined ) {
                            event.preventDefault();
                            nextInput.focus();
                        }
                    }
                }
            });

            $(".bar-info").on('mouseover', function() {
                // position bar-info-container based on the element clicked
                var thisoff = $(this).offset();
                var ttc = $("#bar-info-container");
                ttc.show();
                ttc.css(
                    {"left": (thisoff.left + 10) + "px",
                     "top": (thisoff.top + $(this).height() + 5) + "px"});
                var ttcoff = ttc.offset();
                var right = ttcoff.left + ttc.outerWidth(true);
                if (right > $(window).width()) {
                    var left = $(window).width() - ttc.outerWidth(true) - 20;
                    ttc.offset({"left": left});
                }
                // check offset again, properly set tips to point to the element clicked
                ttcoff = ttc.offset();
                var tipset = Math.max(thisoff.left - ttcoff.left, 0);
                ttc.find(".innertip").css("left", (tipset + 8));
                ttc.find(".outertip").css("left", (tipset + 5));
                var bgcolor = $(this).css("background-color");
                ttc.css("border-color", bgcolor);
                ttc.find(".outertip").css("border-bottom-color", bgcolor);
                ttc.find("p").html($(this).attr("data-tooltip"));
            });
            $(".chart_mask_internal").on("mouseleave", function() {
                var ttc = $("#bar-info-container");
                ttc.hide();
            });

            $(".tooltip-info").click( function(event) {
                event.preventDefault();
                event.stopPropagation();
                // position tooltip-container based on the element clicked
                var thisoff = $(this).offset();
                var ttc = $("#tooltip-container");
                ttc.show();
                ttc.css(
                    {"left": (thisoff.left + 10) + "px",
                     "top": (thisoff.top + $(this).height() + 5) + "px"});
                var ttcoff = ttc.offset();
                var right = ttcoff.left + ttc.outerWidth(true);
                if (right > $(window).width()) {
                    var left = $(window).width() - ttc.outerWidth(true) - 20;
                    ttc.offset({"left": left});
                }
                // check offset again, properly set tips to point to the element clicked
                ttcoff = ttc.offset();
                var tipset = Math.max(thisoff.left - ttcoff.left, 0);
                ttc.find(".innertip").css("left", (tipset + 8));
                ttc.find(".outertip").css("left", (tipset + 5));
                $("#tooltip-container > p").html($(this).attr("data-tooltip"));
                
                $("html").on('click', "body", function() {
                    $("#tooltip-container").hide();
                    $("html").off('click');
                });
                var tooltip = $(this).attr("data-tipname");
                if ( tooltip == undefined ){
                    tooltip = "Name not found";
                }
            });

            // Send email
            $("#send-email").click( function(){
                var email = $('#email').val();
                var request = $.ajax({
                    type: "POST",
                    url: "api/email/",
                    dataType: "json",
                    data:{"id": global.worksheet_id, "email": email}
                });
                request.done( function( result ) {
                    alert("Email sent!");
                });
                request.fail( function( jqXHR, msg ) {
                    alert( "Email failed." );
                });
            });

            // highlight on input click
            $('td').on('click', 'input.school-data', function() {
                var columnNumber = $(this).closest("[data-column]").attr("data-column");
                clearHighlights();
                columns[columnNumber].toggleHighlight('active');
            });

            // toggle save drawer
            $("#save-and-share").click( function( event, native ) {
                if ( global.worksheet_id == "none") {
                    getWorksheetID();
                }
                var posturl = "api/worksheet/" + global.worksheet_id + ".json";
                
                // put schoolData into a nice JSON object
                var json_schools = new Object;
                $.each(schools, function(key, val) {
                    var data = val.schoolData;
                    json_schools[key] = data;                        
                });
                json_schools = JSON.stringify( json_schools );
                var request = $.ajax({
                    type: "POST",
                    url: posturl,
                    dataType: "JSON",
                    data: json_schools
                });
                request.done( function ( result ) {

                });
                request.fail( function ( xmlHttpRequest, textStatus ) {
                    var foo = "";
                    $.each(xmlHttpRequest, function(i, v) {
                        foo += " " + i + ":" + v;
                    });
                    // alert( "Save failed!");
                    $("#save-container").append( "Save failed!" + foo + " " + textStatus);
                });
                var geturl = "http://" + document.location.host
                            + "/paying-for-college/understanding-financial-aid-offers/"
                            + "#"
                            + global.worksheet_id;
                $("#unique").val(geturl);
                var t  = new Date();
                var minutes = t.getMinutes();
                if ( minutes < 10 ) {
                    minutes = "0" + minutes;
                }
                var seconds = t.getSeconds();
                if ( seconds < 10 ) {
                    seconds = "0" + seconds;
                }
                var timestamp = ( t.getMonth() + 1 ) + "/" + t.getDate() + "/" + t.getFullYear();
                timestamp = timestamp + " at " + t.getHours() + ":" + minutes + ":" + seconds;
                $("#timestamp").html("Saved on " + timestamp);
            }); 
            $("#save-current").click( function() {
                $("#save-and-share").trigger("click", ['save-current']);
            });


            // --- Start the page up! --- //

            // Add arrow key navigation in main table. //
            (function ($) {
                $.fn.enableCellNavigation = function () {
                    var arrow = { left: 37, up: 38, right: 39, down: 40 };
             
                    // select all on focus
                    this.find('input').keydown(function (e) {
             
                        // shortcut for key other than arrow keys
                        if ($.inArray(e.which, [arrow.left, arrow.up, arrow.right, arrow.down]) < 0) { return; }
                        var input = e.target;
                        var td = $(e.target).closest('td');
                        var moveTo = null;
                        switch (e.which) {
                            case arrow.left: {
                                if (input.selectionStart == 0) {
                                    moveTo = td.prev('td:has(input,textarea)');
                                }
                                break;
                            }
                            case arrow.right: {
                                if (input.selectionEnd == input.value.length) {
                                    moveTo = td.next('td:has(input,textarea)');
                                }
                                break;
                            }      
                            case arrow.up:
                            case arrow.down: {
                                var tr = td.closest('tr');
                                var pos = td[0].cellIndex;
                                var moveToRow = null;
                                if (e.which == arrow.down) {
                                    moveToRow = tr.next('tr');
                                }
                                else if (e.which == arrow.up) {
                                    moveToRow = tr.prev('tr');
                                }      
                                if (moveToRow.length) {
                                    moveTo = $(moveToRow[0].cells[pos]);
                                }
                                break;
                            }
                        }
             
                        if (moveTo && moveTo.length) {     
                            e.preventDefault();
                            moveTo.find('input,textarea').each(function (i, input) {
                                input.focus();
                                input.select();
                            });
                        }
                    });
                };
            })(jQuery);
             
            $(function() {
              $('#comparison-tables').enableCellNavigation();
            });

            // Check to see if there is restoredata
            if(window.location.hash){
                var wid = window.location.href.substr(window.location.href.lastIndexOf("#")+1);
                var posturl = "api/worksheet/" + wid + ".json";
                var request = $.ajax({
                    type: "POST",
                    url: posturl,
                    data: null
                });
                request.done(function( data, textStatus, jqXHR ) {
                    var data = jQuery.parseJSON(jqXHR.responseText);
                    $.each(data, function(index, schoolData) {
                        var columnNumber = findEmptyColumn();
                        schoolData['origin'] = 'saved';
                        $('#institution-row [data-column="' + columnNumber + '"]').attr("data-schoolid", schoolData.school_id);
                        schools[columnNumber] = new School(schoolData.school_id);
                        schools[columnNumber].schoolData = schoolData;
                        columns[columnNumber].addSchoolInfo(schools[columnNumber].schoolData);
                        columns[columnNumber].updateFormValues(schools[columnNumber].schoolData);
                        calculateAndDraw(columnNumber);
                    });
                    if ( findEmptyColumn() === false ) {
                        maxSchools(true);
                    }
                });
                request.fail(function( jqXHR, msg ) {
                    var responseText = jqXHR.responseText;
                });
            };
        }
    });

    // return functions and classes for testing
    return {
        moneyToNum: moneyToNum,
        numToMoney: numToMoney,
        findEmptyColumn: findEmptyColumn,
        calculateAndDraw: calculateAndDraw,
        getSchoolSearchResults: getSchoolSearchResults,
        getWorksheetID: getWorksheetID,
        processXML: processXML,
        setAddStage: setAddStage,
        clearAddForms: clearAddForms,
        Column: Column,
        School: School
    }
})(jQuery); // end cfpb_pfc_ct namespace anonymous function capsule
