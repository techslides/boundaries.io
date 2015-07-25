var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var path = require('path');

// the options we need to give browserify
var browserifyOptions = {
  cache: {},
  packageCache: {},
  debug: true
};

var ASSETS_PATH = path.join(__dirname, 'app', 'assets');
var JS_ASSETS_PATH = path.join(ASSETS_PATH, 'js');

// gulp.task('test', ['build'], function() {
//   return gulp.src('test/*.js', {read: false})
//     .pipe(mocha())
//     .on('error', console.log.bind(console));
// });

gulp.task('build', function() {
  return gulp.src('src/**/*.es6')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .on('error', console.log.bind(console))
        .pipe(sourcemaps.write('.'))
        .on('error', console.log.bind(console))
        .pipe(gulp.dest('dist'));
});


// watchify task starts the normal bundle, but gives the result to watchify
// watchify then watches the dependency tree and re-compiles only the changed
// modules
gulp.task('watchify', function() {
  return bundleAll(true);
});


// the normal build task to compile all assets (ready for production)
gulp.task('build', function() {
  return bundleAll(false);
});

gulp.task('default', ['build']);


// shared between 'watchify' task and 'build' task
function bundleAll(watch) {
  /**
   * add more bundle calls here
   *
   * bundle(watch, PUBLIC_APP_INPUT, PUBLIC_APP_OUTPUT);
   */
  bundle(watch, ACCOUNT_APP_INPUT, ACCOUNT_APP_OUTPUT);
}


// calls the actual configuration methods and creates the bundle
function bundle(watch, input, output, bundler) {

  if (!bundler) {
    bundler = browserify(input, browserifyOptions);
    bundler.on('log', console.log.bind(console)); // output build logs to terminal
  }

  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      bundle(false, input, output, bundler);
    });
  }

  bundler
    // transform .html into pre-compiled underscore templates
    .transform('jstify')
    // does something...
    .bundle()
    // output any errors to console
    .on('error', function(e) {console.error(e)})
    // establish a destination (filename)
    .pipe(source(path.basename(output)))
    // buffers what we have so far because it isn't technically a stream yet
    .pipe(buffer())
    // pipes the stream into plumber, which catches errors during compilation
    // and notifies us about them as friendly as possible without exiting
    // our gulp process
    .pipe(plumber())
    // create sourcemaps (we're minifying, so we'd love maps)
    .pipe(sourcemaps.init({loadMaps: true}))
    // minify the js
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify({mangle: false})))
    // write sourcemaps to the same dir
    .pipe(sourcemaps.write('./'))
    // pipe to destination folder
    .pipe(gulp.dest(path.dirname(output)));
}