/* global require, module*/

// import modules
var request = require('request');

// get and return the reach
var getReach = function (reachId, callback) {

  // use request-promise to retrieve the reach
  request.get(
    {
      uri: 'http://www.americanwhitewater.org/content/River/detail/id/' + reachId + '/.json',
      json: true
    }, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        callback(body);
      }
    });
};

// reformat reach with selected additional attributes as a GeoJSON Feature Set
var getReachGeoJson = function (reachId, callback) {

  // get the JSON
  getReach(reachId, function (responseJson) {

    // new json object to build up
    var geoJson = {
      'type': 'FeatureCollection',
      'features': []
    };

    // pull out the reach information
    var jsonInfo = responseJson.CContainerViewJSON_view.CRiverMainGadgetJSON_main.info;

    // create the attributes object to add to accesses
    var attributes = {
      'reachId': jsonInfo.id,
      'river': jsonInfo.river,
      'section': jsonInfo.section,
      'altname': jsonInfo.altname,
      'abstract': jsonInfo.abstract,
      'difficulty': jsonInfo.class,
      'type': ''
    };

    // create the putin and takeout features and add them to the geojson

    attributes.type = 'putin';
    geoJson.features.push({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          jsonInfo.plon,
          jsonInfo.plat
        ]
      },
      'properties': attributes
    });

    attributes.type = 'takeout';
    geoJson.features.push({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          jsonInfo.tlon,
          jsonInfo.tlat
        ]
      },
      'properties': attributes
    });

    // invoke the callback with the new GeoJSON
    callback(geoJson);

  }); // getReach

};

// expose functionality externally
module.exports = {
  getReach: getReach,
  getReachGeoJson: getReachGeoJson
};