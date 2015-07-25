import default from Backbone

export default class Geo extends Backbone.Model {

  idAttribute: '_id'

  toLatLng() {
    let props = this.get('properties');
    [props['INTPTLAT10'], props['INTPTLON10']]
  }

  label() {
    return this.get('properties')['GEOID']
  }

}