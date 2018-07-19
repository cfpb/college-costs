const gulp = require( 'gulp' );
const del = require( 'del' );

gulp.task( 'clean', () => {
  return del( './paying_for_college/static/paying_for_college/disclosures' );
} );
