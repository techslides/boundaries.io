package main

import (
  "fmt"
)

type Source struct {
  Url            string
  UrlPrefix      string
  UpsertFields   string
  CollectionName string
}

var LookupTable = map[string][]Source{
  "localtest": {
    {
      Url:            "states.zip",
      UrlPrefix:      "/vsizip/",
      UpsertFields:   "properties.NAME",
      CollectionName: "localtest",
    },
  },
  "postalcodes": {
    {
      Url:            "ftp://ftp2.census.gov/geo/tiger/TIGER2015/ZCTA5/tl_2015_us_zcta510.zip",
      UrlPrefix:      "/vsizip/vsicurl/",
      UpsertFields:   "properties.GEOID10",
      CollectionName: "postalcodes",
    },
  },
  "states": {
    {
      Url:            "ftp://ftp2.census.gov/geo/tiger/TIGER2015/STATE/tl_2015_us_state.zip",
      UrlPrefix:      "/vsizip/vsicurl/",
      UpsertFields:   "properties.NAME",
      CollectionName: "states",
    },
  },
  "places": {
    {
      Url:            "ftp://ftp2.census.gov/geo/tiger/TIGER2015/PLACE/tl_2015_11_place.zip",
      UrlPrefix:      "/vsizip/vsicurl/",
      UpsertFields:   "properties.NAME",
      CollectionName: "places",
    },
  },
}

func main() {


  fmt.Printf("%+v", GetSources("localtest"))
}

func GetSources(name string) []Source {
  return LookupTable[name]
}
