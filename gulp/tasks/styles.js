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
const config = require( '../config' ).styles;
const handleErrors = require( '../utils/handle-errors' );

gulp.task( 'styles:modern', () => {
  return gulp.src( config.cwd + config.src )
    .pipe( gulpSourcemaps.init() )
    .pipe( gulpLess( config.settings ) )
    .on( 'error', handleErrors )
    .pipe( gulpAutoprefixer( {
      browsers: [ 'last 2 version' ]
    } ) )
    .pipe( gulpHeader( banner, { pkg: pkg } ) )
    .pipe( gulpRename( {
      suffix: '.min'
    } ) )
    .pipe( gulpSourcemaps.write( '.' ) )
    .pipe( gulp.dest( config.dest ) );
} );

gulp.task( 'styles:ie', () => {
  return gulp.src( config.cwd + config.src )
    .pipe( gulpLess( config.settings ) )
    .on( 'error', handleErrors )
    .pipe( gulpAutoprefixer( {
      browsers: [ 'IE 7', 'IE 8' ]
    } ) )
    .pipe( mqr( {
      width: '75em'
    } ) )
    .pipe( gulpCssmin() )
    .pipe( gulpRename( {
      suffix:  '.ie',
      extname: '.css'
    } ) )
    .pipe( gulp.dest( config.dest ) );
} );

gulp.task( 'styles',
  gulp.parallel(
    'styles:modern',
    'styles:ie'
  )
);
