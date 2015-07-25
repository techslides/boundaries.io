module.exports = function(router) {

  router.get('/').to('main.about');

  [
    'states',
    'postal-codes',
    'places',
    'neighborhoods',
    'counties'
  ].forEach(function(geo) {
    router.get('/geographies/' + geo + '/whereami').to('geographies/' + geo + '.whereami');
    router.get('/geographies/' + geo + '/nearme').to('geographies/' + geo + '.nearme');
    router.resource('geographies/' + geo);
  });
}