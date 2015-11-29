var Kona = require('kona');
var app = new Kona({root: __dirname});
var compress = require('koa-compress');

// add some middleware
app.on('hook:middleware', function* () {
  this.use(compress());
});

app.initialize().on('ready', function() {
  this.listen();
});