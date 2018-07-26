const gulp = require( 'gulp' );
const gulpAutoprefixer = require( 'gulp-autoprefixer' );
const gulpCssmin = require( 'gulp-cssmin' );
const gulpHeader = require( 'gulp-header' );
const gulpLess = require( 'gulp-less' );
const gulpRename = require( 'gulp-rename' );
const gulpSourcemaps = require( 'gulp-sourcemaps' );
const mqr = require( 'gulp-mq-remove' );
const pkg = require( '../config' ).pkg;
const banner = require( '../config' ).banner;
const configStyles = require( '../config' ).styles;
const handleErrors = require( '../utils/handle-errors' );

gulp.task( 'styles:modern', function() {
  return gulp.src( configStyles.cwd + configStyles.src )
    .pipe( gulpSourcemaps.init() )
    .pipe( gulpLess( configStyles.settings ) )
    .on( 'error', handleErrors )
    .pipe( gulpAutoprefixer( {
      browsers: [ 'last 2 version' ]
    } ) )
    .pipe( gulpHeader( banner, { pkg: pkg } ) )
    .pipe( gulpRename( {
      suffix: '.min'
    } ) )
    .pipe( gulpSourcemaps.write( '.' ) )
    .pipe( gulp.dest( configStyles.dest ) );
} );

gulp.task( 'styles:ie', function() {
  return gulp.src( configStyles.cwd + configStyles.src )
    .pipe( gulpLess( configStyles.settings ) )
    .on( 'error', handleErrors )
    .pipe( gulpAutoprefixer( {
      browsers: [ 'IE 8' ]
    } ) )
    .pipe( mqr( {
      width: '75em'
    } ) )
    .pipe( gulpCssmin() )
    .pipe( gulpRename( {
      suffix:  '.ie',
      extname: '.css'
    } ) )
    .pipe( gulp.dest( configStyles.dest ) );
} );

gulp.task( 'styles', gulp.parallel(
  'styles:modern',
  'styles:ie'
) );
