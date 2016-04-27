var fs = require('fs')
  gulp = require("gulp"),
  del = require('del'),
  babel = require('gulp-babel'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  coffee = require("gulp-coffee"),
  wrap  = require('gulp-wrap');    


gulp.task('clean', function() {
  del.sync(['build/*']);    
  return del.sync(['bin/*']);
});


gulp.task('babel',['clean'],function(){
  return  gulp.src('src/**/*.js')
  .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-runtime']
  }))
  .pipe(gulp.dest('./build'));    
})

gulp.task('weex',['babel'],function(){
  return gulp.src('./build/weex.js')
  .pipe(wrap("#!/usr/bin/env node \n\n<%= contents %>"))
  .pipe(gulp.dest('./bin'))
})


gulp.task('build',['weex'],function(cb){
  return cb()
})

gulp.task('watch',function(){
  gulp.watch('src/**/*.js',['build']);
});

gulp.task('default',['build']);

