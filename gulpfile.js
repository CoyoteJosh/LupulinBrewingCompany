var gulp = require('gulp');
var webserver = require('gulp-webserver');
var exec = require('child_process').exec;
var inject = require('gulp-inject');
var debug = require('gulp-debug');
var runSequence = require('gulp-sequence');


var static = 'static/**/*';
var themes = 'themes/**/*';
var paths = {
    public: 'public',
    index: 'public/index.html',
    themes_javascript: themes + '.js',
    javascript: static + '.js',
    themes_css: themes + '.css',
    css: static + '.css',
    inject: ['public/**/*.html', '!public/node_modules', '!public/node_modules/**']
}


gulp.task('run_hugo', function (cb) {
    exec('hugo --buildDrafts --cleanDestinationDir', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});


gulp.task('start_webserver', function () {
    gulp.src(paths.public).pipe(webserver({
        open: true
    }));
});


gulp.task('scripts', function () {
    gulp.src(paths.inject)
        .pipe(inject(gulp.src('public/**/*.js', { read: false }), { relative: true }))
        .pipe(gulp.dest('public'));
})


gulp.task('css', function () {
    gulp.src(paths.inject)
        .pipe(inject(gulp.src('public/**/*.css', { read: false }), { relative: true }))
        .pipe(gulp.dest('public'));
})


gulp.task('inject', ['scripts', 'css']);


gulp.task('watch', ['run_hugo'], function () {
    gulp.watch([paths.themes_javascript, paths.javascript, paths.themes_css, paths.css], function (event) {
        //once gulp 4.0 is released, which supports running tasks in series, this can be updated and the gulp-sequence package can probably be removed
        runSequence('run_hugo', 'inject')(function (err) {
            if (err) console.log(err);
        });
    });
});


gulp.task('default', ['watch', 'start_webserver']);


