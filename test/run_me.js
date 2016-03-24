/* global require */

var main = require('../main'),
  fs = require('fs');

// canyon creek
main.getReachGeoJson(3066, function(geoJson){
  fs.writeFile('../resources/geojson3066.json', JSON.stringify(geoJson, null, '  '));
});

// north fork feather
main.getReachGeoJson(193, function(geoJson){
  fs.writeFile('../resources/geojson193.json', JSON.stringify(geoJson, null, '  '));
});