'use strict';

/* Notes:
   - this task watches the source files for changes, then fires off the relevant task
   - gulp/tasks/browserSync.js reloads the browser with the compiled files
*/

var gulp = require( 'gulp' );
var config = require( '../config' );
var browserSync = require( 'browser-sync' );

var reload = browserSync.reload;

gulp.task( 'watch', [ 'browserSync' ], function() {
  gulp.watch( config.scripts.src , [ 'scripts', reload ] );
  gulp.watch( config.styles.cwd + '/**/*.less', [ 'styles', reload  ] );
  gulp.watch( config.images.src, [ 'images', reload  ] );
  gulp.watch( config.copy.files.src, [ 'copy:files', reload ] );
  gulp.watch( config.templates.src, [ 'copy:files', reload ] );
} );
