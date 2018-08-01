const gulp = require( 'gulp' );
const gulpEslint = require( 'gulp-eslint' );
const configLint = require( '../config' ).lint;
const handleErrors = require( '../utils/handle-errors' );
const minimist = require( 'minimist' );
const through2 = require( 'through2' );

/**
 * Generic lint a script source.
 * @param {string} src The path to the source JavaScript.
 * @returns {Object} An output stream from gulp.
 */
function _genericLint( src ) {
  // Pass all command line flags to EsLint.
  const options = minimist( process.argv.slice( 2 ) );
  const errorHandler = through2.obj();

  return gulp.src( src, { base: './' } )
    .pipe( gulpEslint( options ) )
    .pipe( gulpEslint.format() )
    .pipe( errorHandler )
    .pipe( gulp.dest( './' ) )
    .on( 'error', handleErrors );
}

/**
 * Lints the gulpfile for errors
 */
gulp.task( 'lint:build', function() {
  return _genericLint( configLint.gulp );
} );

/**
 * Lints the source js files for errors
 */
gulp.task( 'lint:scripts', function() {
  return _genericLint( configLint.src );
} );

/**
 * Lints all the js files for errors
 */
gulp.task( 'lint', gulp.parallel(
  'lint:build',
  'lint:scripts'
) );
