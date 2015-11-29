var GeographiesController = require('../geographies-controller');

var PostalCodesController = GeographiesController.extend({

  constructor: function() {
    GeographiesController.apply(this, arguments);
    this.type = 'PostalCode';
    this.nameKey = 'properties.ZCTA5CE10'
    this.collection = 'postalcodes';
  }

});

module.exports = PostalCodesController;