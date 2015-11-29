var GeographiesController = require('../geographies-controller');

var CountiesController = GeographiesController.extend({

  constructor: function() {
    GeographiesController.apply(this, arguments);
    this.type = 'County';
    this.collection = 'counties';
  }

});

module.exports = CountiesController;