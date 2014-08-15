
var _ = require('lodash');

module.exports = {
  attrs: function (attributes) {
    var attrs = [];
    _.forIn(attributes, function (value, key) {
      attrs.push(key + '="' + value + '"');
    });
    return attrs.join(' ');
  }
};