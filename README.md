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

`curl -H 'Accept: application/json' http://boundaries.io/geographies/postal-codes?search=33060

#### Where Am I?

When querying the `whereami` endpoint, the geography that contains the provided latitude/longitude pair will be returned if found. For instance, when providing a latitude/longitude 

Geographies can be queried via a latitude and longitude pair. 

### Where did the data come from?

Counties, States, Zips, and Places data were collected from
[The US Census Bureau Tiger/Line® Shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html)

Neighborhood data was sourced from
[Zillow's Neighborhood Boundaries](http://www.zillow.com/howto/api/neighborhood-boundaries.htm) shapefile
data and the [Durham Hoods](http://durhamhoods.com/) project.
