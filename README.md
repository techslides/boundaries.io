# boundaries.io

boundaries.io is an API for retrieving GeoJSON for common US geographic topologies. Data is mostly comprised of US Census TIGER data—yielding up-to-date information on the census-defined geographies converted from Shapefile format.

You can query the boundaries.io API for free to retrieve GeoJSON documents in the same format as the shapefiles.


![demo](http://i.imgur.com/syzYebz.gif)

### API Endpoints

Available geographies are as follows:

`['counties', 'postalcodes', 'states', 'cities', 'places']`

These can be substituted anywhere a url references a path segment `:geo-name`

#### Text Search

`geographies/:geo-name?search={query}`

Geographies can be searched via text to match against all attributes. This is helpful as the property names for certain geographies can be very specific in nature to the geography or datasource. For instance, a common 5-digit US postal code is contained in the property `properties.ZCTA5CE10` in the `postal-codes` geography. In order to not keep track of specific collection-based common names like `ZCTA5CE10`, a search paramter is used on the `geographies/:geo-name` endpoint to search all text fields for a url query `?search`.

Example:

```
curl -H 'Accept: application/json' http://boundaries.io/geographies/postal-codes?search=33060
```

#### Where Am I?

`geographies/:geo-name/whereami?lat={latitude}&lng={longitude}`

When querying the `whereami` endpoint, the geography that contains the provided latitude/longitude pair will be returned if found.
For instance, when requesting `geographies/postal-codes/whereami?lat=36.011616617997426&lng=-78.9103317260742`,
the GeoJSON for postal-code 27701 will be returned as the lat/lng pair in the querystring is contained
in the postal-code geography 27701. The corresponding `states` geography would be north carolina.

The corresponding mongodb geospatial query operator is `$geoIntersects`.

Example:

```
curl -H 'Accept: application/json' http://boundaries.io/geographies/postal-codes/whereami?lat=36.011616617997426&lng=-78.9103317260742
```

#### Named

`geographies/:geo-name/named/{name}`

The typical name key for geographies from the US Census TIGER shapefiles is `properties.NAME`, but for postal-codes is
`properties.ZCTA5CE10`. Geographies can be queried against the identifying key with the `named` endpoint.
By making a request to the `named` endpoint, a geography collection can be queried by its common
name property. For postal codes this is the 5-digit common code. For states this is the state name.

Example:

```
curl -H 'accept: application/json' http://boundaries.io/geographies/postal-codes/named/27705
curl -H 'accept: application/json' http://boundaries.io/geographies/states/named/north%20carolina
```

#### Near "Me"

`geographies/:geo-name/nearme?lat={latitude}&lng={longitude}`

Similar to the `whereami` endpoint, one can query the nearby geographies with the `nearme` endpoint. Simply provide a lat/lng

The corresponding mongodb geospatial query operator is `$near`.

Example:

```
curl -H 'Accept: application/json' http://boundaries.io/geographies/postal-codes/nearme?lat=36.011616617997426&lng=-78.9103317260742
```

### Where did the data come from?

Counties, States, Zips, and Places data were collected from
[The US Census Bureau Tiger/Line® Shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html)

Neighborhood data was sourced from
[Zillow's Neighborhood Boundaries](http://www.zillow.com/howto/api/neighborhood-boundaries.htm) shapefile
data and the [Durham Hoods](http://durhamhoods.com/) project.
