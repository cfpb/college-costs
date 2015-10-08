/*
 * Decision tree where each previous choices are visible
 */
(function ($) {
  var slideSpeed = 300,
      scrollSpeed = 500,
      writingHash = true;

  function assignButtons( code ) {
    // this function relies on decisionStackerTargets object
    if (typeof decisionStackerTargets !== "object") {
      return false;
    }
    $elem = $('#q' + decisionStackerTargets[code]['question']);
    var sectionOrigin = $elem.attr('data-ds-origin');
    var sectionData = decisionStackerTargets[sectionOrigin];
    $elem.find('button').each(function() {
      var name = $(this).attr('data-ds-name');
      if ( sectionData.hasOwnProperty( name ) ) {
        $(this).val(sectionData['question'] + sectionData[name]);
      }
    });
  }

  function processHash( position ) {
    hashes = location.hash.replace('#', '').split(':');
    console.log('Clicking button: ');
    console.log($('.ds-buttons:visible button[data-ds-name="' + hashes[position] + '"]'));
    $('.ds-buttons:visible button[data-ds-name="' + hashes[position] + '"]').click();
    if ( position + 1 < hashes.length ) {
      processHash( position + 1 );
    }
  }

  function scrollToDestination( destination ) {
    var scrollTop = $( destination ).offset().top,
        destinationBottom = $( destination ).offset().top + $( destination ).height();
    if ( destination.substring(0,2) == '#q' ) {
      scrollTop = $( '.ds-scroll-top' ).offset().top;
      if ( scrollTop + $(window).height() < destinationBottom ) {
        scrollTop = destinationBottom - $(window).height();
      }
    }
    $( 'html, body' ).animate({
        scrollTop: scrollTop
    }, scrollSpeed);
  }

  $.fn.decisionStacker = function () {
    assignButtons( '0' );
    // Set buttons up to lead to the next section, show appropriate text.
    $('.ds-section .ds-buttons button').click( function() {
      var code = $(this).val();
      var destination = decisionStackerTargets[code]['question'];

      if ( writingHash === true ) {
        if ( location.hash !== '' ) {
          location.hash = location.hash + ':';
        }
        location.hash = location.hash + $(this).attr('data-ds-name');
      }

      // destination is a question
      if ( destination !== undefined ) {
        destination = '#q' + destination;
      }
      // destination is a module
      else {
        destination = '#' + decisionStackerTargets[code]['module'];
        $('.ds-clear-all.ds-clear-after-m').show();
      }
      $( destination ).slideDown( slideSpeed, function() {
        scrollToDestination( destination );
      });
      $( destination ).attr( 'data-ds-origin', code );
      $(this).closest( '.ds-section' ).attr( 'data-ds-decision', $(this).attr( 'data-ds-name' ) );
      assignButtons( code );
      var $section = $(this).closest('.ds-section');
      $section.find('[data-responds-to="' + $(this).attr('data-ds-name') + '"]').show();
      $section.find('.ds-content').slideUp( slideSpeed );
      $('.ds-clear-all.ds-clear-after-q').show();

    });
    $('.ds-response-container .go-back').click( function() {
      var $section = $(this).closest( '.ds-section' ),
          questionNumber = Number( $section.attr( 'data-ds-qnum' ) ),
          hash = '';
      $('.ds-question:visible').each( function(i, val) {
        if ( Number( $(this).attr( 'data-ds-qnum' ) ) > questionNumber ) {
          $(this).find( '.ds-content' ).show();
          $(this).find( '.ds-response-container div' ).hide();
          $(this).hide();
        }
        else if ( Number( $(this).attr( 'data-ds-qnum' ) ) < questionNumber ) {
          // rebuild hash
          if ( i !== 0 ) {
            hash = hash + ':'
          }
          hash = hash + $(this).attr( 'data-ds-decision' );
          console.log('debug: ' + questionNumber + ' - ' + hash);
        }
      });
      $section.find( '.ds-response-container div' ).hide();
      $( '.ds-module' ).hide();
      $section.find( '.ds-content' ).slideDown( slideSpeed, function() {
        scrollToDestination( '#q' + questionNumber );
      });
      // hide clear all when user is on Question #1
      if ( questionNumber === 1 ) {
        $('.ds-clear-all').hide();
      }
      // reset hash
      location.hash = hash;
    });

    $('.ds-clear-button').click( function() {
      $('#q1 .go-back').click();
    });
  };

  $(document).ready( function() {
    if ( location.hash !== '' ) {
      scrollSpeed = 0;
      slideSpeed = 0;
      writingHash = false;
      processHash( 0 );
      scrollSpeed = 500;
      slideSpeed = 300;
      writingHash = true;
    }
  });

}(jQuery));


