var RequestController = require('kona/lib/controller/request');
var topojson = require('topojson');

module.exports = function(config) {

  config.gaTrackingId = 'UA-11539854-15';

  config.mongo = {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    auth: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    collections: ['counties', 'postalcodes', 'states', 'cities', 'places']
  };

  config.port = 3334;

  // add topojson renderer
  RequestController.addRenderer('application/topojson', function *(contents) {

    var features;
    var before;
    var after;
    var reduction;

    features = this.body instanceof Array ? contents : [contents];
    before = JSON.stringify(features).length;
    topology = topojson.topology({collection: {type: "FeatureCollection", features: features}});
    after = JSON.stringify(topology).length;
    reduction = (1 - Math.round((after / before) * 100) / 100)
    // this.ctx.set('X-Topojson-Reduction', reduction > 0 ? reduction : 0);

    return yield topology;
  });

};
