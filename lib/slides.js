
var _ = require('lodash');
var through = require('through2');

module.exports = function (assemble) {
  return through.obj(function (file, encoding, callback) {
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
      file.data.slides = tree.slides;
      this.push(file);
      callback();
    });
};