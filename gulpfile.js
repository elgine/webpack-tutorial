var gulp = require("gulp");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

gulp.task("build", function(){
    gulp.src("./grunt-and-gulp-example/*.js").
        pipe(concat("bundle.js")).
        pipe(uglify()).
        pipe(rename("bundle.min.js")).
        pipe(gulp.dest("./dest"));
});