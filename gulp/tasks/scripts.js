const gulp = require( 'gulp' );
const gulpRename = require( 'gulp-rename' );
const configScripts = require( '../config' ).scripts;
const handleErrors = require( '../utils/handle-errors' );
const webpack = require( 'webpack' );
const webpackConfig = require( '../../config/webpack-config.js' );
const webpackStream = require( 'webpack-stream' );

/**
 * Process JavaScript.
 * @returns {PassThrough} A source stream.
 */
function scripts() {
  return gulp.src( configScripts.entrypoint )
    .pipe( webpackStream( webpackConfig.commonConf, webpack ) )
    .on( 'error', handleErrors.bind( this, { exitProcess: true } ) )
    .pipe( gulpRename( {
      basename: 'main',
      extname: '.js'
    } ) )
    .pipe( gulp.dest( configScripts.dest ) );
}

gulp.task( 'scripts', scripts );
