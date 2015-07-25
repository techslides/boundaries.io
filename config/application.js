module.exports = function(config) {
  config.gaTrackingId = 'UA-11539854-15';
  config.mongo = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME
  };
}