'use strict';

var gulp = require( 'gulp' );
var $ = require( 'gulp-load-plugins' )();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var pkg = require( '../config' ).pkg;
var banner = require( '../config' ).banner;
var config = require( '../config' ).scripts;
var handleErrors = require( '../utils/handleErrors' );
var browserSync = require( 'browser-sync' );

gulp.task( 'scripts', function() {
  var b = browserify({
    entries: config.entrypoint,
    debug: true
  });

  b.bundle()
    .pipe( source( 'main.js' ) )
    .pipe( buffer())
    .pipe( $.sourcemaps.init( { loadMaps: true } ) )
    .pipe( $.uglify() )
    .pipe( $.sourcemaps.write( './' ) )
    .pipe( gulp.dest( config.dest ) )
    .pipe( browserSync.stream() );

  // return gulp.src( config.src )
  //   .pipe( $.sourcemaps.init() )
  //   .pipe( $.concat( config.name ) )
  //   // .pipe( $.uglify() )
  //   .on( 'error', handleErrors )
  //   .pipe( $.header( banner, { pkg: pkg } ) )
  //   .pipe( $.rename( {
  //     suffix: ".min"
  //   } ) )
  //   .pipe( $.sourcemaps.write( '.' ) )
  //   .pipe( gulp.dest( config.dest ) )
  //   .pipe( browserSync.reload( {
  //     stream: true
  //   } ) );
} );
