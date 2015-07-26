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

};
