/*!
 * assemble-slides <https://github.com/doowb/assemble-slides>
 *
 * Copyright (c) 2014 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var assemble = require('assemble');
var through = require('through2');
var _ = require('lodash');

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
    .pipe(through.obj(function (file, encoding, callback) {
      // add the slides to the context for the page
      var slides = assemble.get('slides');
      var keys = _.keys(slides);
      keys.sort(function (a, b) {
        var aLen = a.split('-').length;
        var bLen = b.split('-').length;
        var aData = assemble.get('slides.' + a).data;
        var bData = assemble.get('slides.' + b).data;
        var aOrder = aLen + '-' + (aData && aData.order || 0) + '-' + a;
        var bOrder = bLen + '-' + (bData && bData.order || 0) + '-' + b;
        return aOrder > bOrder;
      });
      console.log('keys', keys);

      var tree = {
        slides: {}
      };
      var key = null;
      while(key = keys.shift()) {
        var parts = key.split('-');
        var part = null;
        var node = tree;
        while (part = parts.shift()) {
          node = node.slides[part] || (node.slides[part] = {slides: {}, slide: assemble.get('slides.' + key)});
        }
      }
      console.log('tree', require('util').inspect(tree, null, 10));
      file.data.slides = tree.slides;
      this.push(file);
      callback();
    }))
    .pipe(assemble.dest('_gh_pages'));
});
