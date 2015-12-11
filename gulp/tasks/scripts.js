'use strict';

var gulp = require( 'gulp' );
var $ = require( 'gulp-load-plugins' )();
var browserify = require( 'browserify' );
var source = require( 'vinyl-source-stream' );
var buffer = require( 'vinyl-buffer' );
var config = require( '../config' ).scripts;
var handleErrors = require( '../utils/handleErrors' );

gulp.task( 'scripts', function() {
  var b = browserify( {
    entries: config.entrypoint,
    debug: true
  } );

  b.bundle()
    .pipe( source( 'main.js' ) )
    .pipe( buffer() )
    .pipe( $.sourcemaps.init( { loadMaps: true } ) )
    .on( 'error', handleErrors )
    .pipe( $.uglify() )
    .pipe( $.sourcemaps.write( './' ) )
    .pipe( gulp.dest( config.dest ) );
} );
