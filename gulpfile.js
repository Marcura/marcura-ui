var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    less = require('gulp-less'),
    wrap = require('gulp-wrap');

var paths = {
    app: {
        root: 'app/',
        html: 'app/**/*.html',
        js: 'app/**/*.js'
    },
    dest: {
        root: 'dest/'
    },
    source: {
        js: 'marcura-ui/**/*.js',
        css: 'marcura-ui/**/*.less'
    }
};

var build = function(complete) {
    runSequence('clean', ['copy-js', 'copy-and-minify-js', 'copy-css'], complete);
}

gulp.task('clean', function() {
    del.sync([paths.dest.root + '/**/*', '!' + paths.dest.root]);
});

gulp.task('copy-js', function() {
    return gulp.src(paths.source.js)
        .pipe(wrap('(function(){<%=contents%>})();'))
        .pipe(concat('marcura-ui.js'))
        .pipe(gulp.dest(paths.dest.root));
});

gulp.task('copy-and-minify-js', function() {
    return gulp.src(paths.source.js)
        .pipe(ngAnnotate())
        .pipe(wrap('(function(){<%=contents%>})();'))
        .pipe(uglify())
        .pipe(concat('marcura-ui.min.js'))
        .pipe(gulp.dest(paths.dest.root));
});

gulp.task('copy-css', function() {
    return gulp.src(paths.source.css)
        .pipe(less())
        .pipe(concat('marcura-ui.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.dest.root));
});

gulp.task('build', function() {
    build(browserSync.reload);
});

gulp.task('start', function() {
    build(function() {
        browserSync.init({
            startPath: paths.app.root,
            server: {
                baseDir: './'
            }
        });

        // watch marcura-ui files
        gulp.watch(paths.source.css, ['copy-css']);
        gulp.watch(paths.source.js).on('change', function() {
            build(browserSync.reload);
        });

        // watch app files
        gulp.watch(paths.app.html).on('change', function() {
            build(browserSync.reload);
        });
    });
});

gulp.task('default', ['start']);
