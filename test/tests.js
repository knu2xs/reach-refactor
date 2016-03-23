/* global require */

// import modules
var expect = require('chai').expect,
  main = require('../main');

// use canyon creek as an example
var canyonCreekId = 3306;

describe('Main reach refactor module', function() {

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

  describe('get reach GeoJson', function(){
    it('retrieves and refactors reach data into GeoJSON', function(){

      // get the JSON
      main.getReachGeoJson(canyonCreekId, function(responseGeoJson){

        // pull out the name from the first feature
        var riverName = responseGeoJson.features[0].properties.river;

        // ensure it actually is canyon creek
        expect(riverName).to.equal('Canyon Creek (Lewis River trib.)');

      });

    })
  });

}); // main refactor