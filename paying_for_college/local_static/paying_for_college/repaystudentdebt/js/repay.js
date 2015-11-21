
var decisionStackerTargets = {
  "0":  {"question": "1", "federal": "a", "non-federal": "b", "both": "c"},
  "1a": {"question": "2", "yes": "a", "no": "b"},
  "1b": {"question": "2", "yes": "c", "no": "d"},
  "2a": {"question": "3", "yes": "a", "no": "b", "not-sure": "b"},
  "2b": {"question": "8", "yes": "a", "no": "b", "not-sure": "b"},
  "2c": {"question": "3", "yes": "c", "no": "d", "not-sure": "d"},
  "2d": {"question": "8", "yes": "c", "no": "d", "not-sure": "d"},
  "3a": {"question": "4", "yes": "a", "no": "b"},
  "3b": {"question": "8", "yes": "a", "no": "b", "not-sure": "b"},
  "3c": {"module": "m12"},
  "3d": {"question": "8", "yes": "c", "no": "e", "not-sure": "e"},
  "4a": {"question": "5", "yes": "a", "no": "b"},
  "4b": {"module": "m5"},
  "5a": {"module": "m4"},
  "5b": {"question": "6", "yes": "a", "no": "b"},
  "6a": {"module": "m5", "yes": "a", "no": "b"},
  "6b": {"question": "7", "yes": "a", "no": "b"},
  "7a": {"module": "m6"},
  "7b": {"module": "m7"},
  "8a": {"question": "9", "yes": "a", "no": "b"},
  "8b": {"question": "9", "yes": "a", "no": "c"},
  "8c": {"question": "9", "yes": "e", "no": "d"},
  "8d": {"question": "9", "yes": "e", "no": "g"},
  "8e": {"question": "9", "yes": "f", "no": "g"},
  "9a": {"module": "m2"},
  "9b": {"module": "m1"},
  "9c": {"module": "m3"},
  "9d": {"module": "m9"},
  "9e": {"module": "m10"},
  "9f": {"module": "m13"},
  "9g": {"module": "m11"}
}; // end decisionStackerTargets

$(document).ready( function() {
  $('.ds-section').decisionStacker();

  $('.read-more .read-more_target').click(function() {
    var $parent = $(this).closest('.read-more');
    if ( $parent.hasClass('read-more_is-closed') ) {
      $parent.find('.read-more_content').slideDown();
      $parent.find('.read-more_open').hide();
      $parent.find('.read-more_close').show();
      $parent.removeClass('read-more_is-closed').addClass('read-more_is-open');
    }
    else {
      $parent.find('.read-more_content').slideUp();
      $parent.find('.read-more_open').show();
      $parent.find('.read-more_close').hide();
      $parent.removeClass('read-more_is-open').addClass('read-more_is-closed');
    }
  });

});





