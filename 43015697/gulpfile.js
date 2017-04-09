var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

gulp.task('sass', function() {
  return gulp.src('../assets/styles/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('../dist/styles'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('js', function() {
  return gulp.src(['../assets/scripts/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../dist/scripts'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    proxy: 'http://127.0.0.1/my_site/new-front-page/',
  })
})

gulp.task('watch', ['sass', 'js', 'browserSync'], function() {
  gulp.watch('../assets/styles/**/*.scss',['sass']);
  gulp.watch('../**/**/*.php', browserSync.reload);
  gulp.watch('../assets/scripts/*.js', browserSync.reload);
  gulp.watch('../*.html', browserSync.reload);
});