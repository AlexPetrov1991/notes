const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync');

gulp.task('server', function(){
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('html', function(){
    gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('css', function(){
    gulp.src('./src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({
        stream: true
    })); 
});

gulp.task('js', function(){
    gulp.src('./src/js/*.js')
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('files', function(){
    gulp.src('./src/img/*.*')
    .pipe(gulp.dest('./dist/img/'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('watch', function(){
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/less/*.less', ['css']);
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch('./src/img/*.*', ['files']);
});

gulp.task('build', ['html', 'css', 'js', 'files']);

gulp.task('default', ['build', 'watch', 'server']);