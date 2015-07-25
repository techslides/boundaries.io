var GeographiesController = require('../geographies-controller');

var PlacesController = GeographiesController.extend({

  constructor: function() {
    GeographiesController.apply(this, arguments);
    this.respondsTo('html', 'json');
    this.type = 'Place';
    this.collection = 'places';
  }

});

module.exports = PlacesController;