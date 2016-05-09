var fs = require('fs')
  gulp = require("gulp"),
  del = require('del'),
  babel = require('gulp-babel'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  browserify = require("browserify"),
  source = require('vinyl-source-stream'),
  path = require('path'),
  less = require('gulp-less'),
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

gulp.task('browserify',['babel'],function(callback){
    browserify("./build/debugger-client.js", { debug: false })
        .bundle()
        .pipe(source('debugger-client-browserify.js'))  //vinyl-source-stream
        .pipe(gulp.dest('./build/'))
    return callback()
})

gulp.task('less',function(){
    return gulp.src('./src/css/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'src/css/', 'includes') ]
    }))
    .pipe(gulp.dest('./build/css'))    ;
})


gulp.task('build',['weex','browserify','less'],function(cb){
    
  return cb()
})

gulp.task('watch',function(){
  gulp.watch('src/**/*.js',['build']);
});

gulp.task('default',['build']);

