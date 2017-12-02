// unnecessary need to remove

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    postcss = require("gulp-postcss"),
    autoprefixer = require('gulp-autoprefixer'),
    mqpacker = require('css-mqpacker'),
    minify = require('gulp-clean-css'),
    uncss = require('gulp-uncss'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    beautify = require('gulp-cssbeautify'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    run = require('run-sequence'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    pump = require('pump');



gulp.task('sass', function() {
  return gulp.src('sass/**/*.sass')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(beautify())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scss', function() {
  return gulp.src('scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(beautify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('less', function() {
  return gulp.src('less/**/*.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(beautify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('pure-css', function() {
  return gulp.src('css/**/*.css')
    .pipe(plumber())
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    notify: false
  });
});

gulp.task('watch-sass', ['browser-sync', 'sass'], function() {
  gulp.watch('sass/**/*.sass', ['sass']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('watch-scss', ['browser-sync', 'scss'], function() {
  gulp.watch('scss/**/*.scss', ['scss']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('watch-less', ['browser-sync', 'less'], function() {
  gulp.watch('less/**/*.less', ['less']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('watch-css', ['browser-sync', 'css'], function() {
  gulp.watch('css/**/*.css', ['css']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
  return del('build');
});

gulp.task('copy', function() {
  return gulp.src([
      'fonts/**',
      'img/**',
      'js/**/*.js',
      'css/**/*.css',
      '*.html'
    ], {
      base: "."
    })
    .pipe(gulp.dest('build'));
});

gulp.task('css', function() {
  return gulp.src('build/css/*.css')
    .pipe(postcss([
      mqpacker({
        sort: true
      })
    ]))
    .pipe(uncss({
            html: ['build/*.html']
    }))
    .pipe(autoprefixer({
      browsers: [
        'last 3 versions'
      ]
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'))
});

gulp.task('scripts', function(cb) {
  pump([
      gulp.src('build/js/**/*.js'),
      uglify(),
      rename({suffix: '.min'}),
      gulp.dest('build/js')
    ],
    cb
  );
});

gulp.task('images', function() {
  return gulp.src('build/img/**/*.{png,PNG,jpeg,jpg,JPG,gif,GIF}')
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      })
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('symbols', function() {
  return gulp.src('build/img/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('build-sass', function(fn) {
  run(
    'sass',
    'clean',
    'copy',
    'css',
    'scripts',
    'images',
    'symbols',
    fn
  );
});

gulp.task('build-scss', function(fn) {
  run(
    'scss',
    'clean',
    'copy',
    'css',
    'scripts',
    'images',
    'symbols',
    fn
  );
});

gulp.task('build-less', function(fn) {
  run(
    'less',
    'clean',
    'copy',
    'css',
    'scripts',
    'images',
    'symbols',
    fn
  );
});

gulp.task('build-css', function(fn) {
  run(
    'clean',
    'copy',
    'css',
    'scripts',
    'images',
    'symbols',
    fn
  );
});
