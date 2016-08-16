var expect = require('chai').expect;
var request = require('supertest');
var Kona = require('kona');
var co = require('co');
var postalcode = require('./fixtures/postal-code');

describe('boundaries.io', function() {

  var agent;
  var coords = {lat: 35.99911854141816, lng: -78.8953971862793}

  // setup seed data
  before(function(done) {
    (new Kona()).initialize().on('ready', function() {

      co.wrap(function *() {
        var db = this.mongo;
        var coll;

        try {
          yield db.dropCollection('postalcodes');
        } catch(e) {}

        coll = yield db.collection('postalcodes');
        yield coll.insert(postalcode);
        yield coll.ensureIndex({geometry: '2dsphere'});

        yield this.shutdown();

      }).call(this).then(done).catch(done);

    });
  });

  beforeEach(function(done) {
    app = new Kona();
    app.initialize().on('ready', function() {
      agent = request.agent(app.server);
      done();
    });
  });

  describe('/', function() {
    it('loads', function(done) {
      agent.get('/').expect(200).expect(/boundaries\.io/, done);
    });
  });

  describe('geographies', function() {

    describe('#whereami', function() {

      it('queries for a geo containing the lat lng pair', function(done) {
        agent
          .get('/geographies/postal-codes/whereami')
          .query(coords)
          .accept('json')
          .expect(200)
          .expect('content-type', 'application/json; charset=utf-8')
          .expect(function(res) {
            expect(res.body._id).to.eq(postalcode._id)
          })
          .end(done);
      });

      it('returns topojson when application/topojson is Accept', function(done) {
        agent
          .get('/geographies/postal-codes/whereami')
          .query(coords)
          .set('Accept', 'application/topojson')
          .expect('content-type', 'application/json; charset=utf-8')
          .expect(200)
          .expect(function(res) {
            expect(res.body.type).to.eq('Topology');
          })
          .end(done);
      });

    });

    describe('named', function() {
      it('returns a geo with a matching name', function(done) {
        agent
          .get('/geographies/postal-codes/named/' + postalcode.properties['GEOID10'])
          .accept('json')
          .expect(200)
          .expect(function(res) {
            expect(res.body._id).to.eq(postalcode._id);
          })
          .end(done);
      });

      describe('.svg', function() {

        it('returns an svg string of the geometry', function(done) {

          var path = '/geographies/postal-codes/named/' + postalcode.properties['GEOID10'] + '.svg';

          agent
            .get(path)
            .expect(200)
            .expect('content-type', 'image/svg+xml')
            .expect(function(res) {
              expect(res.body.toString()).to.contain('M137.69088842490171,190.79525229527445');
            })
            .end(done);

        });

      });

    });

  });

});