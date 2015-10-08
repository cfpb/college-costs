/*jshint maxerr: 10000 */

// Paying for College custom analytics file

var PFCAnalytics = (function() {
    //-- Delay calculations after keyup --//
    var delay = (function(){ 
            var t = 0;
            return function(callback, delay) {
                clearTimeout(t);
                t = setTimeout(callback, delay);
            };
    })(); // end delay()

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

    var global = {
        'schoolsAdded': 0, 'emptyColumn': 1
    }
    var rateChangeClicks = [];
    var schoolsZeroed = ['example'];

    // Fire an event when a school is removed.
    $('.remove-confirm .remove-yes').click( function() {
        var columnNumber = $(this).parents('[data-column]').attr('data-column');
        var schoolID = $('#institution-row [data-column="' + columnNumber + '"]').attr('data-schoolid');
        _gaq.push([ "_trackEvent", "School Interactions", "School Cost Comparison", "School Removed" ] );
        // Important to add a School tracking - reset the global.emptyColumn var
        global.emptyColumn = findEmptyColumn();
    });

    // Fire an event when Left to Pay = $0 and Costs > $0
    $('#comparison-tables').on('keyup', 'input.school-data', function (ev) {
        var columnNumber = $(this).parents('[data-column]').attr('data-column');
        delay(function(){
            var totalCosts = $('.breakdown [data-column="' + columnNumber + '"] .costs-value').html();
            var leftToPay = $('.breakdown [data-column="' + columnNumber + '"] [data-nickname="gap"]').html();
            var schoolID = $('#institution-row [data-column="' + columnNumber + '"]').attr('data-schoolid');
            if (leftToPay === "$0" && totalCosts !== "$0") {
                _gaq.push(["_trackEvent", "School Interactions", "Reached Zero Left to Pay", schoolID]);            
            }
        }, 1000);
    });

    // Fire an event when a tooltip is clicked
    $(".tooltip-info").click( function(event) {
        var tooltip = $(this).attr("data-tipname");
        _gaq.push(["_trackEvent", "Page Interactions", "Tooltip Clicked", tooltip]);
    });

    // Fire an event when GI Bill panel opens
    $(".gibill-calculator, input[data-nickname='gibill']").click(function() {
        var columnNumber = $(this).parents('[data-column]').attr('data-column');
        var schoolID = $("#institution-row [data-column='" + columnNumber + "']").attr("data-schoolid");
        delay(function() {
            var GIPanel = $('[data-column="' + columnNumber + '"] .gibill-panel');
            if (GIPanel.is(':visible')) {
                _gaq.push(["_trackEvent", "School Interactions", "GI Bill Calculator Opened", schoolID]);    
            }
        }, 500);
    });

    // Fire various events for rate-change clicks
    $('.rate-change').click(function() {
        var buttonID = $(this).attr('data-buttonid');
        if (jQuery.inArray(buttonID, rateChangeClicks) === -1) {
            rateChangeClicks.push(buttonID);
            _gaq.push(["_trackEvent", "School Interactions", "Percent Arrow Clicked", buttonID]);
        }
        
    })

    // Fire an event when clicking "Calculate" button 
    $(".gibill-panel .military-calculate").click( function() {
        var columnNumber = $(this).closest("[data-column]").attr("data-column");
        var schoolID = $("#institution-row [data-column='" + columnNumber + "']").attr("data-schoolid");
        var serving = $('[data-column="1"] .military-status-select :selected').html();
        var tier = $("[data-column='1'] .military-tier-select").find(":selected").html();
        var residency = $("[data-column='1'] .military-residency-panel :radio:checked").val();
        var control = $('.header-cell[data-column="' + columnNumber + '"]').attr('data-control');

        _gaq.push(["_trackEvent", "School Interactions", "GI Bill Calculator Submit", schoolID]); 
        _gaq.push(["_trackEvent", "School Interactions", "Military Status", serving]); 
        _gaq.push(["_trackEvent", "School Interactions", "Cumulative service", tier]); 
        if (control == "Public") {
            _gaq.push(["_trackEvent", "School Interactions", "GI Residency", residency]);            
        }
    });

    // Fire an event when Send Email is clicked
    $("#send-email").click( function(){
        _gaq.push([ "_trackEvent", "School Interactions", "Save and Share", "Send email"] );
    });

    // Fire an event when save draw is opened
    $("#save-and-share").click( function( event, native ) {
        if ( native == undefined) {
            _gaq.push([ "_trackEvent", "School Interactions", "Save and Share", "toggle button"] );
        }        
    });

    // Fire an event when save current is clicked
    $("#save-current").click( function() {
        _gaq.push([ "_trackEvent", "School Interactions", "Save and Share", "Save current worksheet"] );
    });

    $("#unique").click( function() {
        _gaq.push([ "_trackEvent", "School Interactions", "Save and Share", "Copy URL"] );  
    });

    $("#save-drawer .save-share-facebook").click( function() {
        _gaq.push([ "_trackEvent", "School Interactions", "Save and Share", "Facebook_saveshare"] );    
    });

    $("#save-drawer .save-share-twitter").click( function() {
        _gaq.push([ "_trackEvent", "School Interactions", "Save and Share", "Twitter_saveshare"] ); 
    });

    // Fire an event when Get Started is clicked
    $('#get-started-button').click(function() {
        _gaq.push([ "_trackEvent", "School Interactions", "School Cost Comparison", "Get Started Button"] ); 
    });

    // Fire an event when Add a School is cancelled
    $('#introduction .add-cancel').click( function() {
        _gaq.push([ "_trackEvent", "School Interactions", "School Cost Comparison", "Cancel Button"] ); 
    });

    // Fire an event when Continue is clicked
    $('#introduction .continue').click( function() {
        _gaq.push([ "_trackEvent", "School Interactions", "School Cost Comparison", "Continue Button"] ); 
    });

    // Fire an event when Add another school is clicked
    $('#introduction .add-another-school').click( function() {
        _gaq.push([ "_trackEvent", "School Interactions", "School Cost Comparison", "Add another school Button"] ); 
    });

    // Fire an event when adding a school.
    function newSchoolEvent() {
        var schoolID = $("#school-name-search").attr("data-schoolid");
        var program = $('#step-two input:radio[name="program"]:checked').val();
        var kbyoss = $("#school-name-search").attr("data-kbyoss");
        var prgmlength = String($('#step-two select[name="prgmlength"]').val());
        var housing = $('input[name="step-three-housing"]:checked').val();
        var control = $("#school-name-search").attr("data-control");
        var residency = $('input[name="step-three-residency"]:checked').val();
        var offer = "No";

        global.schoolsAdded++;
        var schoolCount = String(global.schoolsAdded);
        if ( $("#finaidoffer").is(":checked")) {
            offer = "Yes";
        }
        _gaq.push([ "_trackEvent", "School Interactions", "Total Schools Added", schoolCount ] );
        _gaq.push([ "_trackEvent", "School Interactions", "School Added", schoolID ] );
        _gaq.push([ "_trackEvent", "School Interactions", "Program Type", program ] );
        _gaq.push([ "_trackEvent", "School Interactions", "Program Length", prgmlength ] );

        if (offer === "Yes") {
            _gaq.push([ "_trackEvent", "School Interactions", "Financial Aid Clicked"] );
            if ( $('#xml-text').val() === "" &&  kbyoss == "Yes") {
                _gaq.push([ "_trackEvent", "School Interactions", "School Added - XML", "Blank"] );
            }
            else if ( $('#xml-text').val() !== "" && kbyoss == "Yes") {
                _gaq.push([ "_trackEvent", "School Interactions", "School Added - XML", "XML text"] );
            }
        }

        else {
            _gaq.push([ "_trackEvent", "School Interactions", "Housing", housing ] );
            if (control == "Public") {
                _gaq.push([ "_trackEvent", "School Interactions", "Residency", residency ] );
            }
        }
    }

    // Check for a new school added when .continue and .add-another-school are clicked
    $('#introduction .continue, #introduction .add-another-school').click( function() {
        delay(function() {
            var newEmpty = findEmptyColumn();
            if (newEmpty != global.emptyColumn) {
                newSchoolEvent();
                global.emptyColumn = newEmpty;
            }
        }, 500);

    });

    // Fire event when user clicks the arrows to open sections
    $('.arrw-collapse').click(function() {
        var arrwName = $(this).attr('data-arrwname');
        _gaq.push([ "_trackEvent", "School Interactions", arrwName, "Drop Down" ] );
    });

    //## OLDER CODE BELOW ##//
    // PFC menu tracking
    $('.pfc-nav a').click(function(e) {
        
        // Save the href so we can change the url with js
        var link_text = $(this).text();
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)
        e.preventDefault();

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'Page Interactions', 'Menu Click', link_text]); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en
        setTimeout(function() { document.location.href = link_url; }, 500);

    });

    // Collapsed content click tracking
    $('.ec').click(function() {
        _gaq.push(['_trackEvent', 'Page Interactions', 'Click', 'Collapsed_Accordion_Options']);
    });
    $('.bubble-top-text').click(function() {
        _gaq.push(['_trackEvent', 'Page Interactions', 'Click', 'Collapsed_Accordion_Options_Questions']);
    });

    // Link tracking project-wide
    // Build delay on on exit links (500ms)
    $('.exit-link').click(function() {
        var link_text = $(this).text();
        var link_url = $(this).attr('href')
        _gaq.push(['_trackEvent', 'Exit Link', link_text, link_url]);
            function setTimeout() { 
            if (_target == undefined || _target.toLowerCase() !== '_blank' || _target.toLowerCase() !== '_new') {
                setTimeout(function() { location.href =  _href; }, 500);
                return false;
            }
        }
    });
    $('.internal-link').click(function(e) {

        // Save useful variables
        var link_text = $(this).text();
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)
        e.preventDefault();

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'Internal Link', link_text, link_url]); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en
        setTimeout(function() { document.location.href = link_url; }, 500);
    });
    $('.school-link').click(function(e) {

        // Save useful variables
        var link_text = $(this).text();
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'School Interactions', link_text]); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en

        setTimeout(function() { window.open(link_url, '_blank'); }, 500);

    });
    // Email address submission on /paying-for-college/
    /* $('.email-button').click(function() {
        var link_text = $(this).text();
        var link_url = $(this).attr('href')
        _gaq.push(['_trackEvent', 'Submission', link_text, link_url]);
    }); */
    // Track social sharing project-wide
    // Landing page sharing
    $('.share-links > .share-facebook').click(function(e) {

        // Save the href so we can change the url with js
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)
        e.preventDefault();

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'Social', 'Share', 'Facebook_Top']); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en
        setTimeout(function() { document.location.href = link_url; }, 500);

    });
    $('.share-links > .share-twitter').click(function(e) {
        
        // Save the href so we can change the url with js
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)
        e.preventDefault();

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'Social', 'Share', 'Twitter_Top']); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en
        setTimeout(function() { document.location.href = link_url; }, 500);

    });
    $('.share-links > .share-email').click(function(e) {
        
        // Save the href so we can change the url with js
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)
        e.preventDefault();

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'Social', 'Share', 'Email_Top']); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en
        setTimeout(function() { document.location.href = link_url; }, 500);

    });

    // Bottom sharing box
    $('.botshare > .share-facebook').click(function(e) {

        // Save the href so we can change the url with js
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)
        e.preventDefault();

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'Social', 'Share', 'Facebook_Bottom']); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en
        setTimeout(function() { document.location.href = link_url; }, 500);

    });
    $('.botshare > .share-twitter').click(function(e) {
        
        // Save the href so we can change the url with js
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)
        e.preventDefault();

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'Social', 'Share', 'Twitter_Bottom']); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en
        setTimeout(function() { document.location.href = link_url; }, 500);

    });
    $('.botshare > .share-email').click(function(e) {
        
        // Save the href so we can change the url with js
        var link_url = $(this).attr('href');

        // Stop the link from going anywhere
        // (it's ok we saved the href and we'll fire it later)
        e.preventDefault();

        // Use a try statement in case there are google analytics errors
        // that could prevent the rest of this code from changing the url
        // thus breaking the link completely instead of delaying it!

        try { _gaq.push(['_trackEvent', 'Social', 'Share', 'Email_Bottom']); }
        catch( error ) {}

        // Give google analytics time to do its thing before changing the page url
        // http://support.google.com/analytics/answer/1136920?hl=en
        setTimeout(function() { document.location.href = link_url; }, 500);

    });

    // Tracks file downloads project-wide
    $('a[href$="zip"],a[href$="pdf"],a[href$="doc"],a[href$="docx"],a[href$="xls"],a[href$="xlsx"],a[href$="ppt"],a[href$="pptx"],a[href$="txt"],a[href$="csv"]').click(function() {
        var link_text = $(this).text();
        var link_url = $(this).attr('href')
        _gaq.push(['_trackEvent','Downloads', link_text, link_url]);
    });
})(jQuery);
