var GeographiesController = require('../geographies-controller');

var StatesController = GeographiesController.extend({

  constructor: function() {
    GeographiesController.apply(this, arguments);
    this.type = 'State';
    this.collection = 'states';
  }

});

module.exports = StatesController;