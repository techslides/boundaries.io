var elasticsearch = require('elasticsearch');
var ApplicationController = require('./application-controller');

var GeographiesController = ApplicationController.extend({

  constructor: function() {
    ApplicationController.apply(this, arguments);
    this.respondsTo('html', 'json', 'application/topojson');
    this.beforeFilter('_setType', '_mountCollection');
    this.nameKey = 'properties.NAME';
  },

  _setType: function* () {
    this.set('type', this.type);
  },

  _mountCollection: function* () {
    this.geos = yield this.mongo.collection(this.collection);
    this.es = new elasticsearch.Client;
  },

  index: function* () {
    var geos = [];
    if (this.request.query.search) {
      geos = yield this.geos.find({
        $text: {$search: this.request.query.search}
      }, {
        score: {$meta: "textScore"}
      })
      .sort({score: {$meta: 'textScore'}})
      .limit(this.request.query.limit || 15)
      .toArray();
    }
    this.set('geographies', geos);
    yield this.respondWith(geos);
  },

  autocomplete: function* () {
    var query = {
      index: this.collection,
      type: 'geo',
      body: {
        name_suggestion: {
          text: this.params.query || this.params.q,
          completion: {
            field: 'suggest'
          }
        }
      }
    };
    console.log(query)
    var results = yield this.es.suggest(query);

    console.log(results);

    yield this.respondWith(results);
  },

  show: function* () {
    var geo = yield this.geos.findOne({
      _id: this.mongo._db.bsonLib.ObjectID(this.params.id)
    });
    this.set('geography', geo);
    yield this.respondWith(geo);
  },

  named: function* () {
    yield this.respondWith(this.findByName(this.params.name));
  },

  findByName: function* (name) {
    var query = {};
    query[this.nameKey] = this.params.name;

    var results = yield this.es.search({
      index: this.collection,
      type: 'geo',
      body: {
        query: {
          match: query
        }
      },
      size: 1
    });
    return results.hits.hits.map((res) => res._source);
  },

  whereami: function* () {
    var thenable = this.at(this.params.lat, this.params.lng);
    yield this.respondWith(thenable);
  },

  nearme: function* () {
    var thenable = this.near(this.params.lat, this.params.lng);
    yield this.respondWith(thenable);
  },

  at: function* (lat, lng, options) {
    options || (options = {});

    var lat = parseFloat(lat, 10);
    var lng = parseFloat(lng, 10);
    var where;

    if (isNaN(lat) || isNaN(lng)) return this.throw(304, 'Bad Request');
    if (!lat || !lng) return this.throw(304, 'Bad Request');

    where = {
      index: this.collection,
      type: 'geo',
      size: 1,
      body: {
        query: {
          bool: {
            must: {
              match_all: {}
            },
            filter: {
              geo_shape: {
                geometry: {
                  shape: {
                    type: 'Point',
                    coordinates: [lng, lat]
                  }
                }
              }
            }
          }
        }
      }
    };

    var results = yield this.es.search(where);

    return results.hits.hits.map((res) => res._source);
  },

  near: function* (lat, lng, options) {
    options || (options = {});

    var lat = parseFloat(lat, 10);
    var lng = parseFloat(lng, 10);
    var where;

    if (isNaN(lat) || isNaN(lng)) return this.throw(304, 'Bad Request');

    options = kona._.merge({limit: 5}, options);
    where = {
      geometry: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      }
    };

    return yield this.geos.find(where, options).toArray();
  },

});

module.exports = GeographiesController;