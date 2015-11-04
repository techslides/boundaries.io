var ApplicationController = require('./application-controller');
var fs = require('fs');
var marked = require('marked');

var MainController = ApplicationController.extend({
  about: function*() {
    var markdown = fs.readFileSync(process.cwd() + '/README.md').toString();
    var html = marked(markdown);
    this.set('readme', html);
  },
  show: function*() {
    yield this.respondTo({
      html: function*() {
        this.render(this.params.path);
      }
    });
  }
});

module.exports = MainController;