
// load the main assemble library
var assemble = require('assemble');

// load the slides bundle
require('..');


assemble.task('default', ['slides']);
