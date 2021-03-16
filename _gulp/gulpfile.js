'use strict';

const gulp = require('gulp'),
      gulpif = require('gulp-if'),
      pug = require('gulp-pug'),
      emitty = require('emitty').setup('_pug', 'pug'),
      plumber = require('gulp-plumber'),
      browserSync = require('browser-sync'),
      scss = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      plugins = require('gulp-load-plugins')(),
      cleanCSS = require('gulp-clean-css'),
      tinypng = require('gulp-tinypng'),
      rimraf = require('rimraf'),
      rename = require('gulp-rename'),
      wait = require('gulp-wait2'),
      emailBuilder = require('gulp-email-builder'),
      fs = require('fs'),
      realFavicon = require ('gulp-real-favicon')
;

// Ключ активации для оптимизации 500 бесплатных картинок в месяц на сайте https://tinypng.com/
// Ключ зарегистрирован на почту haoss_ut@mail.ru
// Нужен новый ключ, регистрируется на другую (свою) почту 
const TINYPNG_API = "GuAIy8BmW79-zVDoYRzRR_9eVe-QnhlN";

gulp.task('emailBuilder', function() {
  return gulp.src(['./dist/email.html'])
    .pipe(emailBuilder().build())
    .pipe(rename('email-inline.html'))
    .pipe(gulp.dest('./dist/'));
});

// Pug
gulp.task('pug', () =>
  new Promise((resolve, reject) => {
    emitty.scan(global.emittyChangedFile).then(() => {
      gulp.src('_pug/*.pug')
        .pipe(plumber())
        .pipe(gulpif(global.watch, emitty.filter(global.emittyChangedFile)))
        .pipe(pug({
          pretty: '    '
        }))
        .pipe(gulp.dest('dist'))
        .on('end', resolve)
        .on('error', reject);
    });
  })
);

// Sass
gulp.task('scss', function () {
  return gulp.src('_scss/main.scss')
    .pipe(wait(1500))
    .pipe(plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(scss({

    }).on('error', scss.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename('style.min.css'))
    .pipe(plugins.sourcemaps.write("/"))
    .pipe(gulp.dest('dist/css/'))
});

// Tinypng
gulp.task('tiny', function () {
  return gulp.src('_tinypng/**/*.{png,jpg}')
    .pipe(tinypng(TINYPNG_API))
    .pipe(gulp.dest('dist/images/tinypng/'))
});
gulp.task('rimraf', function (cb) {
  rimraf('.gulp', cb);
});
gulp.task('compress', gulp.series('tiny', 'rimraf'));

// Static server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    notify: false,
    // reloadDelay: 3000
  });
});

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('favicon-1-generate', function(done) {
  realFavicon.generateFavicon({
    masterPicture: './_favicon/favicon.png',
    dest: './dist/favicon/',
    iconsPath: './favicon/',
    design: {
      ios: {
        pictureAspect: 'noChange'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override'
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'projectName',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override'
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 53.90625,
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

gulp.task('favicon-2-inject', function() {
  return gulp.src([ './dist/index.html' ])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('favicon-3-check-for-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});

// Your "watch" task
gulp.task('watch', () => {
  global.watch = true;

  gulp.watch('_pug/**/*.pug', gulp.series('pug'))
    .on('all', (event, filepath) => {
      global.emittyChangedFile = filepath;
    });
  gulp.watch('_scss/**/*.scss', gulp.series('scss'));
  gulp.watch('dist/js/*.js').on("change", browserSync.reload);
  gulp.watch('dist/css/*.css').on('change', browserSync.reload);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});

// Default
gulp.task('default', gulp.parallel('browser-sync', 'watch'));