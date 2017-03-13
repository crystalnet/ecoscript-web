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
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';

const $ = gulpLoadPlugins({DEBUG: false});
const reload = browserSync.reload;
let development = ($.util.env.dev || false);

// Inject dependencies into index.html
gulp.task('inject', () => {
  $.util.log($.util.colors.green('Development mode: ' + development));

  let wiredep = require('wiredep').stream;
  let injectOptions = {
    ignorePath: ['.tmp/', 'app/', 'dist/'],
    addRootSlash: false,
    selfClosingTag: true,
    transform: function (filepath) {
      if (filepath.slice(-3) === '.js') {
        return '<script src="' + filepath + '"></script></>\r\n';
      }
      if (filepath.slice(-4) === '.css') {
        return '<link rel="stylesheet" href="' + filepath + '" />\r\n';
      }
      // Use the default transform as fallback:
      return inject.transform.apply(inject.transform, arguments);
    }
  };
  let wiredepOptions = {};

  let injectStyles = gulp.src([
      'app/styles/*.css'
    ], { read: false }
  );

  let injectScripts = gulp.src([
    // selects all js files from .tmp dir
    'app/scripts/**/*.js',
    '!app/scripts/sw/**/*.*',
    'app/components/**/*.js'
    // then uses the gulp-angular-filesort plugin
    // to order the file injection
  ]).pipe($.angularFilesort()
    .on('error', $.util.log));

  return gulp.src('app/index.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    // write the injections to the .tmp/index.html file
    .pipe(gulp.dest('.tmp'))
});


// Collapse js and css imports and concatenate them
gulp.task('collapse', () => {
  return gulp.src([
    '.tmp/index.html',
    'app/**/*.html',
    'app/**/*.htm',
    '!app/index.html',
    '!app/libraries/**/*.*'
  ])
    .pipe($.useref({
      searchPath: 'app'
  }))
    .pipe($.replace(/<!--\s*build:css(\s|\S)*endbuild\s*-->/g, '<link rel="styles/main.min.css"/>'))
    .pipe($.replace(/<!--\s*build:js(\s|\S)*endbuild\s*-->/g, '<script src="scripts/main.min.js"></script>'))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe($.if('*.htm', $.size({title: 'htm', showFiles: true})))
    .pipe(gulp.dest('.tmp'));
});

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src(['app/scripts/**/*.js','!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

// Optimize images
gulp.task('images', () =>
  gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe($.size({title: 'images'}))
    .pipe(gulp.dest('.tmp/images'))
);

// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'app/*.*',
    '.tmp/**/*.*',
    'node_modules/apache-server-configs/dist/.htaccess',
    'app/libraries/material-design-lite/material.min.css.map',
    '!app/index.html'
  ], {
    dot: true
  })
    .pipe($.if(development, gulp.dest('.tmp')))
    .pipe($.if(!development, gulp.dest('dist')))
    .pipe($.size({title: 'copy'}))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
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
    '.tmp/**/*.scss',
    '.tmp/**/*.css'
  ])
    //.pipe($.newer('.tmp'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      includePaths : 'app/styles'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp'));
});

// Minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', () =>
  gulp.src([
    '.tmp/**/*.js',
    '!.tmp/scripts/sw/**/*.js'
  ])
    //.pipe($.newer('.tmp'))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe($.uglify({preserveComments: 'license'}))
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp'))
);

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src([
    '.tmp/**/*.html',
    '.tmp/**/*.htm',
    '!app/libraries/**/*.*',
    '!app/index.html'
  ])

    // Minify any HTML
    .pipe($.if(!development,
      $.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe($.if('*.htm', $.size({title: 'htm', showFiles: true})))
    .pipe(gulp.dest('.tmp'))
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
gulp.task('default', ['clean'], cb =>
  runSequence(
    ['inject'],
    ['collapse'],
    [/* TODO 'lint' ,*/'styles', 'scripts', 'images'],
    ['copy'],
    ['generate-service-worker'],
    cb
  )
);

// Build development files
gulp.task('development', ['clean'], cb => {
  development = true;

  runSequence(
    ['inject'],
    ['collapse'],
    cb
  )
});

// Watch files for changes & reload
gulp.task('serve', ['development'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp'],
    port: 3000
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/**/*.htm'], reload);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['lint', 'scripts', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync({
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
