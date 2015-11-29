var RequestController = require('kona/lib/controller/request');
var topojson = require('topojson');

module.exports = function(config) {

  config.gaTrackingId = 'UA-11539854-15';

  config.mongo = process.env.DB_URL;

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
