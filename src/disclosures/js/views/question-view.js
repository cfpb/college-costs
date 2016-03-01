'use strict';

var questionView = {
  $getOptions: $( '.get-options' ),
  $followupNoNotSure: $( '.followup__no-not-sure' ),
  $followupYes: $( '.followup__yes' ),
  $nextSteps: $( '.next-steps' ),
  $feedback: $( '.feedback' ),

  init: function() {
    this.bigQuestionListener();
  },

  bigQuestionListener: function() {
    var $answerButtons = $( '.question_answers > .btn' );
    $answerButtons.on( 'click', function() {
      $answerButtons.removeClass( 'active' );
      $( this ).addClass( 'active' );
      if ( $( this ).attr( 'id' ) === 'question_answer-yes' ) {
        questionView.$followupYes.show();
        questionView.$followupNoNotSure.hide();
      } else {
        questionView.$followupNoNotSure.show();
        questionView.$followupYes.hide();
      }
      // Show the rest of the page
      questionView.$getOptions.show();
      questionView.$nextSteps.show();
      questionView.$feedback.show();
      $( 'html, body' ).stop().animate( {
        scrollTop: questionView.$getOptions.offset().top - 120
      }, 900, 'swing', function() {} );
    } );
  }

};

module.exports = questionView;
