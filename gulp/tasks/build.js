'use strict';

var gulp = require( 'gulp' );

gulp.task( 'build',
  [
    'styles',
    'browserify',
    'scripts',
    'images',
    'copy'
  ]
);
