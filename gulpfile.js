var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cleanCss = require('gulp-clean-css'),
    less = require('gulp-less'),
    wrap = require('gulp-wrap'),
    karma = require('karma'),
    karmaConfig = __dirname + '/tests/config/karma/karma.js',
    jshint = require('gulp-jshint');

var paths = {
    app: {
        root: 'app/',
        html: 'app/**/*.html',
        js: 'app/**/*.js',
        css: 'app/**/*.css'
    },
    dist: {
        root: 'dist/'
    },
    source: {
        // Order of the files is important.
        js: [
            'marcura-ui/select-box/select2.js',
            'marcura-ui/**/*.js'
        ],
        css: [
            'marcura-ui/less.less',
            'marcura-ui/pace/pace.less',
            'marcura-ui/button/button-variables.less',
            'marcura-ui/pager/pager-variables.less',
            'marcura-ui/button/button.less',
            'marcura-ui/check-box/check-box.less',
            'marcura-ui/date-box/date-box.less',
            'marcura-ui/grid/grid.less',
            'marcura-ui/grid/sort.less',
            'marcura-ui/label/label.less',
            'marcura-ui/message/message.less',
            'marcura-ui/multi-check-box/multi-check-box.less',
            'marcura-ui/pager/pager.less',
            'marcura-ui/progress/progress.less',
            'marcura-ui/radio-box/radio-box.less',
            'marcura-ui/radio-button/radio-button.less',
            'marcura-ui/select-box/select2.less',
            'marcura-ui/select-box/select-box.less',
            'marcura-ui/spinner/spinner.less',
            'marcura-ui/tabs/tabs.less',
            'marcura-ui/text-area/text-area.less',
            'marcura-ui/html-area/html-area.less',
            'marcura-ui/text-box/text-box.less',
            'marcura-ui/tooltip/tooltip.less'
        ]
    }
};

var build = function (complete) {
    runSequence('clean', ['check-js', 'copy-js', 'copy-and-minify-js', 'copy-css'], complete);
}

gulp.task('clean', function () {
    del.sync([paths.dist.root + '/**/*', '!' + paths.dist.root]);
});

gulp.task('copy-js', function () {
    return gulp.src(paths.source.js)
        .pipe(wrap('(function(){<%=contents%>})();'))
        .pipe(concat('marcura-ui.js'))
        .pipe(gulp.dest(paths.dist.root));
});

gulp.task('copy-and-minify-js', function () {
    return gulp.src(paths.source.js)
        .pipe(wrap('(function(){<%=contents%>})();'))
        .pipe(uglify())
        .pipe(concat('marcura-ui.min.js'))
        .pipe(gulp.dest(paths.dist.root));
});

gulp.task('check-js', function () {
    return gulp.src(paths.source.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('copy-css', function () {
    return gulp.src(paths.source.css)
        .pipe(less().on('error', function (error) {
            console.log(error);
            this.emit('end');
        }))
        .pipe(concat('marcura-ui.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest(paths.dist.root))
        .pipe(browserSync.stream());
});

gulp.task('build', function () {
    build(browserSync.reload);
});

gulp.task('start', function () {
    build(function () {
        browserSync.init({
            startPath: paths.app.root,
            server: {
                baseDir: './'
            }
        });

        // Watch marcura-ui files
        gulp.watch(paths.source.css, ['copy-css']);
        gulp.watch(paths.source.js).on('change', function () {
            build(browserSync.reload);
        });

        // Watch app files
        gulp.watch(paths.app.css).on('change', function () {
            build(browserSync.reload);
        });
        gulp.watch(paths.app.js).on('change', function () {
            build(browserSync.reload);
        });
        gulp.watch(paths.app.html).on('change', function () {
            build(browserSync.reload);
        });
    });
});

gulp.task('test', function (done) {
    new karma.Server({
        configFile: karmaConfig,
        action: 'run'
    }, function () {
        done();
    })
        .start();
});

gulp.task('test-single', function (done) {
    new karma.Server({
        configFile: karmaConfig,
        singleRun: true
    }, function () {
        done();
    })
        .start();
});

gulp.task('default', ['start']);