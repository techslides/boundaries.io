var GeographiesController = require('../geographies-controller');

var PostalCodesController = GeographiesController.extend({

  constructor: function() {
    GeographiesController.apply(this, arguments);
    this.respondsTo('html', 'json');
    this.type = 'PostalCode';
    this.collection = 'postalcodes';
  }

});

module.exports = PostalCodesController;