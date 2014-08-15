/*!
 * assemble-slides <https://github.com/doowb/assemble-slides>
 *
 * Copyright (c) 2014 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var assemble = require('assemble');
var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var slides = require('./lib/slides');

var base = path.resolve('src/templates/slides');
var relative = path.relative.bind(path, base);

var slideLayouts = path.relative(process.cwd(), path.join(__dirname, '/src/templates/layouts/*.hbs'));
var slidePartials = path.relative(process.cwd(), path.join(__dirname, '/src/templates/partials/*.hbs'));
var slideHelpers = path.relative(process.cwd(), path.join(__dirname, '/src/helpers/*.js'));

var localSlides = path.relative(process.cwd(), path.join(process.cwd(), 'src/templates/slides/**/*.md'));

assemble.template('slide', { plural: 'slides', isLayout: true });
assemble.layouts(slideLayouts);
assemble.partials(slidePartials);
assemble.helpers(slideHelpers);
assemble.slides(localSlides, {
  rename: function (filepath) {
    var name = relative(filepath);
    return name
      .replace(path.extname(name), '')
      .replace(/[\\\/]/g, '-');
  }
});

assemble.task('slides', function () {
  assemble.src(__dirname + '/src/templates/pages/index.hbs')
    .pipe(slides(assemble))
    .pipe(assemble.dest('_gh_pages'));
});

assemble.task('slides:new', function () {
  var slide = argv.slide;
  if (!slide) {
    throw new Error('Use --slide to specify a the name of the new slide');
  }
  var filepath = path.join(base, slide + '.md');
  var dirs = path.dirname(path.relative(base, filepath));
  if (dirs !== '.') {
    mkdirp.sync(path.join(base, dirs));
  }
  fs.writeFileSync(filepath, '### ' + slide);
});
