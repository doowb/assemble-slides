
var _ = require('lodash');
var handlebars = require('assemble/node_modules/handlebars');
var marked = require('remarked');

var tmpl = [
  '{{#each this.slides}}',
  '  {{> slide .}}',
  '{{/each}}'
].join('\n');

module.exports = {
  slide: function (item, options) {
    var content = null;
    if (!_.isEmpty(item.slides)) {
      var ctx = _.extend({}, this, {slides: item.slides});
      content = handlebars.compile(tmpl)(ctx);
    }
    var data = handlebars.createFrame({content: new handlebars.SafeString([item.slide.contents.toString(), content].join('\n'))})
    return marked(options.fn(this, {data: data}));
  }
};