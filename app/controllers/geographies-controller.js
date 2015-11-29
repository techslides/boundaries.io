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

  show: function* () {
    var geo = yield this.geos.findOne({
      _id: this.mongo._db.bsonLib.ObjectID(this.params.id)
    });
    this.set('geography', geo);
    yield this.respondWith(geo);
  },

  named: function* () {
    var criteria = {};
    var geo;
    criteria[this.nameKey] = new RegExp(this.params.name, 'i');
    try {
      geo = yield this.geos.findOne(criteria);
    } catch (e) {}
    if (geo) {
      this.set('geography', geo);
      yield this.respondWith(geo);
    } else {
      this.throw(404);
    }
  },

  whereami: function* () {
    var geo = yield this.at(this.params.lat, this.params.lng);
    yield this.respondWith(geo);
  },

  nearme: function* () {
    var geos = yield this.near(this.params.lat, this.params.lng);
    yield this.respondWith(geos);
  },

  at: function* (lat, lng, options) {
    options || (options = {});

    var lat = parseFloat(lat, 10);
    var lng = parseFloat(lng, 10);
    var where;

    if (isNaN(lat) || isNaN(lng)) {
      return yield this.throw(304, 'Bad Request');
    }
    if (!lat || !lng) return yield this.throw(304, 'Bad Request');

    options = kona._.merge({limit: 5}, options);
    where = {
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      }
    };

    return yield this.geos.find(where, options).toArray();
  },

  near: function* (lat, lng, options) {
    options || (options = {});

    var lat = parseFloat(lat, 10);
    var lng = parseFloat(lng, 10);
    var where;

    if (isNaN(lat) || isNaN(lng)) {
      return yield this.throw(304, 'Bad Request');
    }

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