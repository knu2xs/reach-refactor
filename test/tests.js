/* global require */

// import modules
var expect = require('chai').expect,
  main = require('../main');

// use canyon creek as an example
var canyonCreekId = 3306;

describe('Canyon Creek', function() {

  // use canyon creek as an example
  var canyonCreekId = 3306;

  describe('get reach', function (){
    it('retrieves reach data', function(){

      // get the JSON body response
      main.getReach(canyonCreekId, function(responseJson){

        // extract out the returned reach id from the JSON body response
        var responseReachId = responseJson.CContainerViewJSON_view.CRiverMainGadgetJSON_main.info.id;

        // ensure it matches
        expect(responseReachId).to.equal(canyonCreekId);

      });
    });
  });

  describe('get river name', function(){
    it('tests if river name is in the feature properties', function(){

      // get the JSON
      main.getReachGeoJson(canyonCreekId, function(responseGeoJson){

        // pull out the name from the first feature
        var riverName = responseGeoJson.features[0].properties.river;

        // ensure it actually is canyon creek
        expect(riverName).to.equal('Canyon Creek (Lewis River trib.)');

      });

    })
  });

  describe('get putin coordinates', function(){
    it('tests if putin coordinates are correct', function(){

      // get the JSON
      main.getReachGeoJson(canyonCreekId, function(responseGeoJson){

        // pull out the name from the first feature
        var riverName = responseGeoJson.features[0].geometry.coordinates;

        // ensure it actually is canyon creek
        expect(riverName).to.equal([-122.316, 45.94]);

      });

    })
  });

}); // main refactor