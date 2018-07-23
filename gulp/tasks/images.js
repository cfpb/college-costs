const gulp = require( 'gulp' );
const gulpChanged = require( 'gulp-changed' );
const gulpImagemin = require( 'gulp-imagemin' );
const config = require( '../config' ).images;
const handleErrors = require( '../utils/handle-errors' );

gulp.task( 'images', () => {
  return gulp.src( config.src )
    .pipe( gulpChanged( config.dest ) )
    .pipe( gulpImagemin() )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( config.dest ) );
} );
