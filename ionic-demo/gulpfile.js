var gulp = require('gulp')
var gutil = require('gulp-util')
var bower = require('bower')
var concat = require('gulp-concat')
var sass = require('gulp-sass')
var minifyCss = require('gulp-minify-css')
var rename = require('gulp-rename')
var sh = require('shelljs')
var babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')
var templateCache = require('gulp-angular-templatecache')
var gulpNgConfig = require('gulp-ng-config')
var runSequence = require('run-sequence')
var del = require('del')

var paths = {
  js: ['./app/**/*.js'],
  sass: ['./scss/**/*.scss'],
  template: ['./app/**/*.html'],
  appConfig: ['./config/app-config.json'],
  compiled: './www/compiled/',
}

var env = process.env.ENV || 'dev'

gutil.log('Environment:', gutil.colors.green.bold(env))

gulp.task('default', ['build'])

gulp.task('build', function(done) {
  runSequence(
    'clean',
    ['js', 'sass', 'template', 'appConfig'],
    done
  )
})

gulp.task('clean', function() {
  return del(paths.compiled)
})

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .on('error', displayBabelError)
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.compiled))
})

gulp.task('sass', function() {
  return gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest(paths.compiled))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.compiled))
})

gulp.task('template', function() {
  return gulp.src(paths.template)
    .pipe(templateCache({
      root: 'app',
      module: 'app.templates',
    }))
    .pipe(gulp.dest(paths.compiled))
})

gulp.task('appConfig', function() {
  return gulp.src(paths.appConfig)
    .pipe(gulpNgConfig('app', {
      createModule: false,
      environment: env
    }))
    .on('error', displayBabelError)
    .pipe(gulp.dest(paths.compiled))
})

gulp.task('watch', function() {
  gulp.watch(paths.js, ['js'])
  gulp.watch(paths.sass, ['sass'])
  gulp.watch(paths.template, ['template'])
  gulp.watch(paths.appConfig, ['appConfig'])
})

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message)
    })
})

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    )
    process.exit(1)
  }
  done()
})

function displayBabelError(e) {
  console.log(e.toString())
  console.log(e.codeFrame, '\n')
  this.emit('end')
}
