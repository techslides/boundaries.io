var GeographiesController = require('../geographies-controller');

var NeighborhoodsController = GeographiesController.extend({

  constructor: function() {
    GeographiesController.apply(this, arguments);
    this.type = 'Neighborhood';
    this.collection = 'neighborhoods';
  }

});

module.exports = NeighborhoodsController;