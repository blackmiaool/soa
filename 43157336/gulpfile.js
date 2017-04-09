'use strict';
const gulp = require('gulp');
const transform = require('gulp-transform');
const rename = require("gulp-rename");

gulp.task('default', function () {
    return gulp.src("./gulpfile.js")
        .pipe(transform(() => JSON.stringify({a:1,b:2})))
        .pipe(rename("a.json"))
        .pipe(gulp.dest("dist/"))
});
