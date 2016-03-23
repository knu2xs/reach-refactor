/* global require, module*/

// import modules
var request = require('request');

// helper function to get the middle value for finding centroids
var getMeanCoordinate = function(coordinate01, coordinate02){

  // make sure they are both floating point
  var coord01 = parseFloat(coordinate01),
    coord02 = parseFloat(coordinate02);

  // get the difference between the two numbers
  var meanDifference = Math.abs(coord01 - coord02) / 2;

  // add the difference to the minimum coordinate and return the result
  return (Math.min(coord01, coord02) + meanDifference);

};

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
      'name': null,
      'altname': jsonInfo.altname,
      'abstract': jsonInfo.abstract,
      'difficulty': jsonInfo.class,
      'description': jsonInfo.description,
      'tags': null
    };

    // create the putin and takeout features and add them to the geojson if they exist in the data
    if(jsonInfo.plon && jsonInfo.plat) {
      attributes.tags = 'access, putin';
      geoJson.features.push({
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            parseFloat(jsonInfo.plon),
            parseFloat(jsonInfo.plat)
          ]
        },
        'properties': JSON.parse(JSON.stringify(attributes))
      });
    }

    if(jsonInfo.tlon && jsonInfo.tlat){
      attributes.tags = 'access, takeout';
      geoJson.features.push({
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            parseFloat(jsonInfo.tlon),
            parseFloat(jsonInfo.tlat)
          ]
        },
        'properties': JSON.parse(JSON.stringify(attributes))
      });
    }

    // if both the putin and takeout exist, create a centroid
    if(jsonInfo.plon && jsonInfo.plat && jsonInfo.tlon && jsonInfo.tlat){
      attributes.tags = 'centroid';
      geoJson.features.push({
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            getMeanCoordinate(jsonInfo.plon, jsonInfo.tlon),
            getMeanCoordinate(jsonInfo.plat, jsonInfo.tlat)
          ]
        },
        'properties': JSON.parse(JSON.stringify(attributes))
      });
    }
    
    // if the rapids key exists in the response JSON
    if (responseJson.CContainerViewJSON_view.hasOwnProperty('CRiverRapidsGadgetJSON_view-rapids')) {

      // save the rapids array to a variable
      var rapids = responseJson.CContainerViewJSON_view['CRiverRapidsGadgetJSON_view-rapids'].rapids;

      // set the attributes
      attributes = {
        'reachId': jsonInfo.id,
        'river': jsonInfo.river,
        'section': jsonInfo.section,
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
              parseFloat(rapids[i].rlon),
              parseFloat(rapids[i].rlat)
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