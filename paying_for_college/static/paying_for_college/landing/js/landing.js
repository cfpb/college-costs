$( document ).ready(function() {
    // Make the drop down menus accessible on focus //
    $(".pfc-nav-wrapper").find( "a, .fake-link" ).on( "focus blur", function() {
        $(this).parents().toggleClass( "focus" );
    } );
});