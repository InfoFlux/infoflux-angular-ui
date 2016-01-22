/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var gulpLess = require('gulp-less');
var templateCache = require('gulp-angular-templatecache');
var htmlClean = require('gulp-htmlclean');
var es = require('event-stream');
var angularFileSort = require('gulp-angular-filesort');
var concat = require('gulp-concat');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var minifyCss = require('gulp-minify-css');
var addSrc = require('gulp-add-src');
var ngAnnotate = require('gulp-ng-annotate');
var ngMin = require('gulp-ngmin');
var pkg = require('./package.json');
var header = require('gulp-header');
var fsExtra = require('fs-extra');
var fs = require('fs');
var request = require('request');
var nuget = require('gulp-nuget');

var config = {
    ui: {
        srcRoot: 'if.ui',
        module: 'if.ui',
        tempTemplates: 'templates.js'


    },
    distFolder: 'dist'

};

var paths = {
    ui: {
        srcScripts: [config.ui.srcRoot + '/if.ui.js', config.ui.srcRoot + '/**/*.js'],
        srcTemplates: config.ui.srcRoot + '/**/*.html',
        srcLess: config.ui.srcRoot + '/**/*.less',
        templatesTemp: config.distFolder + '/' + config.ui.tempTemplates,
        cssFileName: config.ui.module + '.css',
        jsFileName: config.ui.module + '.js',
        distFiles: [config.distFolder + '/if.ui.**'],
        nuget: config.distFolder + '/' + config.ui.nuget
    },

    dist: config.distFolder,
    nuget: 'nuget.exe'

};

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');



gulp.task('clean-dist-all', function () {
    del.sync([paths.dist + '/*.js', paths.dist + '/*.css'])
});

gulp.task('clean-dist-script', function () {
    del.sync([paths.dist + '/*.js'])
});

gulp.task('clean-dist-css', function () {
    del.sync([paths.dist + '/*.css'])
});

////// IF ANGULAR UI BUILD
gulp.task('build-if-ui', ['build-if-ui-css', 'build-if-ui-scripts'], function () { });

gulp.task('build-if-ui-scripts', ['clean-dist-script', 'build-template-cache'], function () {

    return gulp.src(paths.ui.srcScripts)
        .pipe(addSrc(paths.ui.templatesTemp))
        .pipe(angularFileSort())
        .pipe(concat(paths.ui.jsFileName))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(paths.dist))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build-template-cache', function () {
    return gulp.src(paths.ui.srcTemplates)
        .pipe(htmlClean())
        .pipe(templateCache(config.ui.tempTemplates, { root: config.ui.srcRoot, module: config.ui.module }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build-if-ui-css', ['clean-dist-css'], function () {
    return gulp.src(paths.ui.srcLess)
        .pipe(gulpLess())
        .pipe(concat(paths.ui.cssFileName))
        .pipe(gulp.dest(paths.dist))
        .pipe(minifyCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(paths.dist));
});

