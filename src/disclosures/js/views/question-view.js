'use strict';

var questionView = {
  $getOptions: $( '.get-options' ),
  $followupNoNotSure: $( '.followup__no-not-sure' ),
  $followupYes: $( '.followup__yes' ),
  $nextSteps: $( '.next-steps' ),
  $feedback: $( '.feedback' ),

  init: function() {
    this.$followupNoNotSure.hide();
    this.$followupYes.hide();
    this.$getOptions.hide();
    this.$nextSteps.hide();
    this.$feedback.hide();
    this.bigQuestionListener();
  },

  bigQuestionListener: function() {
    $( '.question_answers > .btn' ).on( 'click', function() {
      if ( $( this ).attr( 'id' ) === 'question_answer-yes' ) {
        questionView.$followupYes.show();
        questionView.$followupNoNotSure.hide();
      } else {
        questionView.$followupNoNotSure.show();
        questionView.$followupYes.hide();
      }
      // Show the rest of the page with a 600 millisecond animation.
      questionView.$getOptions.show( 'slow' );
      questionView.$nextSteps.show( 'slow' );
      questionView.$feedback.show( 'slow' );
    } );
  }

};

module.exports = questionView;
