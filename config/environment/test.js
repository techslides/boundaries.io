module.exports = function(config) {

  config.mongo = process.env.TEST_DB_URL || 'mongodb://db/geo_test';

};