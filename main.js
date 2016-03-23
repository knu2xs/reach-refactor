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
      'name': jsonInfo.section,
      'altname': jsonInfo.altname,
      'abstract': jsonInfo.abstract,
      'difficulty': jsonInfo.class,
      'description': jsonInfo.description,
      'tags': null
    };

    // create the putin and takeout features and add them to the geojson

    attributes.tags = 'access, putin';
    geoJson.features.push({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          jsonInfo.plon,
          jsonInfo.plat
        ]
      },
      'properties': JSON.parse(JSON.stringify(attributes))
    });

    attributes.tags = 'access, takeout';
    geoJson.features.push({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          jsonInfo.tlon,
          jsonInfo.tlat
        ]
      },
      'properties': JSON.parse(JSON.stringify(attributes))
    });
    
    // if the rapids key exists in the response JSON
    if (responseJson.CContainerViewJSON_view.hasOwnProperty('CRiverRapidsGadgetJSON_view-rapids')) {

      // save the rapids array to a variable
      var rapids = responseJson.CContainerViewJSON_view['CRiverRapidsGadgetJSON_view-rapids'].rapids;

      // set the attributes
      attributes = {
        'reachId': jsonInfo.id,
        'river': jsonInfo.river,
        'name': null,
        'altname': null,
        'abstract': null,
        'difficulty': null,
        'description': null,
        'tags': null
      };

      // iterate the rapids...more just points of interest, really
      for (var i = 0; i < rapids.length; i++){

        // variable to store list of potential tags
        var tags = [];

        // check for properties and add relevant to tags
        if(rapids[i].isaccess){
          tags.push('access, intermediate');
        }
        if(rapids[i].isportage){
          tags.push('portage');
        }
        if(rapids[i].ishazard){
          tags.push('hazard');
        }
        if(rapids[i].iswaterfall){
          tags.push('waterfall');
        }
        if(rapids[i].isplayspot){
          tags.push('playspot');
        }
        if(rapids[i].difficulty){
          tags.push('rapid');
        }

        // set attribute properties
        attributes.name = rapids[i].name;
        attributes.difficulty = rapids[i].difficulty;
        attributes.description = rapids[i].description;
        attributes.tags = tags.join(', ');

        // add a rapid
        geoJson.features.push({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              rapids[i].rlat,
              rapids[i].rlon
            ]
          },
          'properties': JSON.parse(JSON.stringify(attributes))
        });

      }
    }

    // invoke the callback with the new GeoJSON
    callback(geoJson);

  }); // getReach

};

// expose functionality externally
module.exports = {
  getReach: getReach,
  getReachGeoJson: getReachGeoJson
};