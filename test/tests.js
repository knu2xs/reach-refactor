/* global require */

// import modules
var expect = require('chai').expect,
  main = require('../main');

// use canyon creek as an example
var canyonCreekId = 3306;

describe('Main reach refactor module', function() {
  describe('get reach', function (){
    it('retrieves and refactors reach data', function(){

      // get the JSON body response
      main.getReach(canyonCreekId, function(responseJson){

        // extract out the returned reach id from the JSON body response
        var responseReachId = responseJson.CContainerViewJSON_view.CRiverMainGadgetJSON_main.info.id;

        // ensure it matches
        expect(responseReachId).to.equal(canyonCreekId);
        
      });
    });
  });
});