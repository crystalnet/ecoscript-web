/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
// import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';

const $ = gulpLoadPlugins({
  DEBUG: false
});
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
let nocompression = ($.util.env.nocompression || false);
let noconcat = ($.util.env.noconcat || false);

// Inject dependencies into index.html
gulp.task('inject', () => {
  let wiredep = require('wiredep').stream;
  let injectOptions = {
    ignorePath: ['.tmp/', 'app/', 'dist/'],
    addRootSlash: false,
    selfClosingTag: true,
    transform: function (filepath) {
      if (filepath.slice(-3) === '.js') {
        return '<script src="' + filepath + '"></script>\r\n';
      }
      if (filepath.slice(-4) === '.css') {
        return '<link rel="stylesheet" href="' + filepath + '" />\r\n';
      }
      // Use the default transform as fallback:
      return $.inject.transform.apply($.inject.transform, arguments);
    }
  };
  let wiredepOptions = {};

  let injectStyles = gulp.src([
      'app/styles/*.css'
    ], {read: false}
  );

  let injectScripts = gulp.src([
      // selects all js files from .tmp dir
      'app/components/**/*.js',
      'app/scripts/**/*.js',
      '!app/scripts/sw/**/*.*'
    ], {base: 'app/'}
  )
  // then uses the gulp-angular-filesort plugin
  // to order the file injection
    .pipe($.angularFilesort()
      .on('error', $.util.log));

  return gulp.src('app/index.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    // write the injections to the .tmp/index.html file
    .pipe(gulp.dest('.tmp'));
});

// Concatenate js and css imports collapse statements
gulp.task('concat', () => {
  return gulp.src([
    '.tmp/index.html'
  ])
    .pipe($.useref({
      searchPath: '.tmp'
    }))
    .pipe($.replace(/<!--\s*build:css(\s|\S)*?endbuild\s*-->/g,
      '<link rel="stylesheet" href="styles/main.min.css">'))
    .pipe($.replace(/<!--\s*build:js(\s|\S)*?endbuild\s*-->/g,
      '<script src="scripts/main.min.js"></script>'))
    // Output files
    .pipe($.size({title: 'html', showFiles: true}))
    .pipe(gulp.dest('.tmp'));
});

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src([
    'app/scripts/**/*.js',
    'app/components/**/*.js',
    '!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

// Optimize images
gulp.task('compress-images', () => {
  return gulp.src([
      'app/images/**/*'
    ], {base: 'app/'}
  )
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe($.size({title: 'compress-images'}))
    .pipe(gulp.dest('.tmp/'));
});

// Copy all files at the root level (app)
gulp.task('copy-tmp', () =>
  gulp.src([
      '.tmp/index.html',
      '.tmp/images/**/*.*',
      '.tmp/scripts/main.min.js',
      '.tmp/styles/main.min.css',
      '.tmp/components/**/*.htm'
    ], {dot: true, base: '.tmp/'}
  )
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy-tmp'}))
);

// Copy all files at the root level (app)
gulp.task('copy-scripts', () =>
  gulp.src([
      'app/components/**/*.js',
      'app/scripts/**/*.js',
      '!app/scripts/sw/**/*.js'
    ], {base: 'app/'}
  )
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'copy-scripts'}))
);

// Copy all files at the root level (app)
gulp.task('copy-libraries', () =>
  gulp.src([
      // TODO replace with your bower modules location
      'app/libraries/**/*.js'
    ], {base: 'app/'}
  )
    .pipe($.newer('.tmp/libraries'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'copy-scripts'}))
);

// Copy all files at the root level (app)
gulp.task('copy-styles', () =>
  gulp.src([
      'app/styles/**/*.css',
      '!app/styles/src/**/*.css'
    ], {base: 'app/'}
  )
    .pipe($.newer('.tmp/styles'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'copy-htm'}))
);

// Copy all files at the root level (app)
gulp.task('copy-htm', () =>
  gulp.src([
      'app/components/**/*.htm'
    ], {base: 'app/'}
  )
    .pipe($.newer('.tmp/components'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'copy-htm'}))
);

// Copy all files at the root level (app)
gulp.task('copy-html', () =>
  gulp.src([
      'app/components/**/*.html',
      '!app/index.html'
    ], {base: 'app/'}
  )
    .pipe($.newer('.tmp/components'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size({title: 'copy-html'}))
);

// Copy all files at the root level (app)
gulp.task('copy-service-worker', () =>
  gulp.src([
    'app/service-worker.js'
  ])
    .pipe(gulp.dest('.tmp'))
);

// Copy htaccess
gulp.task('copy-htaccess', () =>
  gulp.src([
      'node_modules/apache-server-configs/dist/.htaccess'
    ], {dot: true}
  )
    .pipe(gulp.dest('dist'))
);

// Copy htaccess
gulp.task('copy-htaccess-tmp', () =>
  gulp.src([
      'node_modules/apache-server-configs/dist/.htaccess'
    ], {dot: true}
  )
    .pipe(gulp.dest('.tmp'))
);

// Compiles sass and prefixes them
gulp.task('compile-styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      'app/styles/*.css'
    ], {base: 'app/'}
  )
  // .pipe($.newer('.tmp'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      includePaths: 'app/styles'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.size({title: 'compile-styles'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp'));
});

// Compile and automatically prefix stylesheets
gulp.task('compress-styles', () => {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
      '.tmp/styles/**/*.css'
    ], {base: '.tmp/'}
  )
  // .pipe($.newer('.tmp'))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'compress-styles'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp'));
});

// Transpile JavsScript (only from user)
gulp.task('transpile-scripts', () =>
  gulp.src([
      'app/scripts/**/*.js',
      'app/components/**/*.js',
      '!app/scripts/sw/**/*.js'
    ], {base: 'app/'}
  )
  // .pipe($.newer('.tmp'))
    .pipe($.newer('.tmp/'))
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      compact: false
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe($.size({title: 'transpile-scripts'}))
    .pipe(gulp.dest('.tmp'))
);

// Minify JavaScript (only from user)
gulp.task('compress-scripts', () => {
  gulp.src([
      '.tmp/scripts/**/*.js',
      '.tmp/components/**/*.js',
      '!.tmp/scripts/sw/**/*.js'
    ], {base: '.tmp/'}
  )
  // .pipe($.newer('.tmp'))
    .pipe($.sourcemaps.init())
    .pipe($.uglify({
      preserveComments: 'license',
      hoist_funs: false,
      compress: {hoist_funs: false}
    }))
    .on('error', function (err) {
      $.util.log(err);
    })
    .pipe($.sourcemaps.write('.'))
    .pipe($.size({title: 'compress-scripts'}))
    .pipe(gulp.dest('.tmp'));
});

// Scan your HTML for assets & optimize them
gulp.task('compress-html', () => {
  return gulp.src([
      '.tmp/*.html',
      '.tmp/components/**/*.html'
    ], {base: '.tmp/'}
  )

  // Minify any HTML
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('.tmp'));
});

// Copy over the scripts that are used in importScripts as part of the generate-service-worker task.
gulp.task('copy-sw-scripts', () => {
  return gulp.src(['node_modules/sw-toolbox/sw-toolbox.js', 'app/scripts/sw/runtime-caching.js'])
    .pipe(gulp.dest('dist/scripts/sw'));
});

// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
gulp.task('generate-service-worker', ['copy-sw-scripts'], () => {
  const rootDir = 'dist';
  const filepath = path.join(rootDir, 'service-worker.js');

  return swPrecache.write(filepath, {
    // Used to avoid cache conflicts when serving on localhost.
    cacheId: pkg.name || 'web-starter-kit',
    // sw-toolbox.js needs to be listed first. It sets up methods used in runtime-caching.js.
    importScripts: [
      'scripts/sw/sw-toolbox.js',
      'scripts/sw/runtime-caching.js'
    ],
    staticFileGlobs: [
      // Add/remove glob patterns to match your directory setup.
      `${rootDir}/images/**/*`,
      `${rootDir}/scripts/**/*.js`,
      // TODO add components
      `${rootDir}/styles/**/*.css`,
      `${rootDir}/*.{html,json}`
    ],
    // Translates a static file path to the relative URL that it's served from.
    // This is '/' rather than path.sep because the paths returned from
    // glob always use '/'.
    stripPrefix: rootDir + '/'
  });
});

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile'
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb)
);

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Build production files, the default task
// Files are compressed
gulp.task('default', ['clean'], cb => {
  nocompression = false;
  $.util.log($.util.colors.green('Compression mode: ' + !nocompression));
  $.util.log($.util.colors.green('Concatenation mode: ' + !noconcat));

  if (noconcat) {
    runSequence(
      ['inject', 'copy-htm', 'copy-html', 'copy-libraries',
        'compile-styles', 'transpile-scripts'],
      ['compress-styles', 'compress-scripts', 'compress-images'],
      ['compress-html'],
      ['copy-tmp', 'copy-htaccess'],
      ['generate-service-worker'],
      cb
    );
  } else {
    runSequence(
      ['inject', 'copy-htm', 'copy-html', 'copy-libraries',
        'compile-styles', 'transpile-scripts'],
      ['compress-styles', 'compress-scripts', 'compress-images'],
      ['concat'],
      ['compress-html'],
      ['copy-tmp', 'copy-htaccess'],
      ['generate-service-worker'],
      cb
    );
  }
});

// Build development files
// Files are not compressed in development
gulp.task('development', ['clean'], cb => {
  nocompression = true;
  $.util.log($.util.colors.green('Compression mode: ' + !nocompression));
  $.util.log($.util.colors.green('Concatenation mode: ' + !noconcat));

  if (noconcat) {
    runSequence(
      ['inject', 'compile-styles', 'transpile-scripts', 'copy-htm',
        'copy-html', 'copy-libraries', 'compress-images',
        'copy-service-worker', 'copy-htaccess-tmp'],
      cb
    );
  } else {
    runSequence(
      ['inject', 'compile-styles', 'transpile-scripts', 'copy-htm',
        'copy-html', 'copy-libraries', 'compress-images',
        'copy-service-worker', 'copy-htaccess-tmp'],
      //['concat'],
      cb
    );
  }
});

// Watch files for changes & reload
gulp.task('serve', ['development'], () => {
  browserSync.init({
    logLevel: 'info',
    notify: true,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    https: true,

    server: {
      baseDir: '.tmp',
      middleware: [
        historyApiFallback()
      ]
    },
    port: 3000
  })
  ;

  gulp.watch(['app/**/*.html'], ['inject', reload]);
  gulp.watch(['app/**/*.htm'], ['copy-htm', reload]);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['compile-styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['transpile-scripts', reload]);
  gulp.watch(['app/components/**/*.js'], ['transpile-scripts', reload]);
  gulp.watch(['app/images/**/*'], ['compress-images', reload]);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync.init({
    notify: false,
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    port: 3001
  })
);

// Load custom tasks from the `tasks` directory
// Run: `npm install --save-dev require-dir` from the command-line
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
